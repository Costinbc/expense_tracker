using System.Net;
using MobyLabWebProgramming.Core.Constants;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Errors;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Core.Specifications;
using MobyLabWebProgramming.Infrastructure.Database;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

public class ExpenseService(IRepository<WebAppDatabaseContext> repository, IMailService mailService) : IExpenseService
{
    public async Task<ServiceResponse<ExpenseDTO>> GetExpense(Guid id, Guid requestingUserId, CancellationToken cancellationToken = default)
    {
        var result = await repository.GetAsync(new ExpenseProjectionSpec(id), cancellationToken);

        if (result == null)
        {
            return ServiceResponse.FromError<ExpenseDTO>(new(HttpStatusCode.NotFound, "Expense not found!", ErrorCodes.ExpenseNotFound));
        }

        if (result.UserId != requestingUserId)
        {
            return ServiceResponse.FromError<ExpenseDTO>(new(HttpStatusCode.Forbidden, "You can only view your own expenses!", ErrorCodes.AccessDenied));
        }

        return ServiceResponse.ForSuccess(result);
    }

    public async Task<ServiceResponse<PagedResponse<ExpenseDTO>>> GetExpenses(PaginationSearchQueryParams pagination, Guid requestingUserId, CancellationToken cancellationToken = default)
    {
        var result = await repository.PageAsync(pagination, new ExpenseProjectionSpec(pagination.Search, requestingUserId), cancellationToken);

        return ServiceResponse.ForSuccess(result);
    }

    public async Task<ServiceResponse> AddExpense(ExpenseAddDTO expense, Guid userId, CancellationToken cancellationToken = default)
    {
        var category = await repository.GetAsync(new CategorySpec(expense.CategoryId), cancellationToken);
        if (category == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Category not found!", ErrorCodes.CategoryNotFound));
        }

        var paymentMethod = await repository.GetAsync(new PaymentMethodSpec(expense.PaymentMethodId), cancellationToken);
        if (paymentMethod == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Payment method not found!", ErrorCodes.PaymentMethodNotFound));
        }

        var entity = new Expense
        {
            Amount = expense.Amount,
            Description = expense.Description,
            Date = expense.Date,
            CategoryId = expense.CategoryId,
            PaymentMethodId = expense.PaymentMethodId,
            UserId = userId
        };

        await repository.AddAsync(entity, cancellationToken);
        
        var emailResult = await mailService.SendMail(
            recipientEmail: "your-test@mailtrap.io",
            subject: "New Expense Added",
            body: $"A new expense of {entity.Amount:C} was added in category '{category.Name}' on {entity.Date:dd MMM yyyy}.",
            isHtmlBody: false,
            cancellationToken: cancellationToken
        );

        if (!emailResult.IsOk)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.InternalServerError, "Failed to send email notification!", ErrorCodes.EmailNotificationFailed));
        }

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdateExpense(ExpenseUpdateDTO expense, Guid userId, CancellationToken cancellationToken = default)
    {
        var entity = await repository.GetAsync(new ExpenseSpec(expense.Id, expense.UserId), cancellationToken);

        if (entity == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Expense not found!", ErrorCodes.ExpenseNotFound));
        }

        if (entity.UserId != userId)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You can only update your own expenses!", ErrorCodes.AccessDenied));
        }

        if (expense.CategoryId.HasValue)
        {
            var category = await repository.GetAsync(new CategorySpec(expense.CategoryId.Value), cancellationToken);
            if (category == null)
            {
                return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Category not found!", ErrorCodes.CategoryNotFound));
            }
        }

        if (expense.PaymentMethodId.HasValue)
        {
            var paymentMethod = await repository.GetAsync(new PaymentMethodSpec(expense.PaymentMethodId.Value), cancellationToken);
            if (paymentMethod == null)
            {
                return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Payment method not found!", ErrorCodes.PaymentMethodNotFound));
            }
        }

        entity.Amount = expense.Amount ?? entity.Amount;
        entity.Description = expense.Description ?? entity.Description;
        entity.Date = expense.Date ?? entity.Date;
        entity.CategoryId = expense.CategoryId ?? entity.CategoryId;
        entity.PaymentMethodId = expense.PaymentMethodId ?? entity.PaymentMethodId;

        await repository.UpdateAsync(entity, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeleteExpense(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var entity = await repository.GetAsync(new ExpenseSpec(id, userId), cancellationToken);

        if (entity == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Expense not found!", ErrorCodes.ExpenseNotFound));
        }

        if (entity.UserId != userId)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You can only delete your own expenses!", ErrorCodes.AccessDenied));
        }

        await repository.DeleteAsync<Expense>(id, cancellationToken);

        return ServiceResponse.ForSuccess();
    }
}
