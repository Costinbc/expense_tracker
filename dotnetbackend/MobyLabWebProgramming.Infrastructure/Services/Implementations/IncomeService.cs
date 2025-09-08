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

public class IncomeService(IRepository<WebAppDatabaseContext> repository) : IIncomeService
{
    public async Task<ServiceResponse<IncomeDTO>> GetIncome(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var result = await repository.GetAsync<Income, IncomeDTO>(new IncomeProjectionSpec(id), cancellationToken);
        return result != null ? ServiceResponse.ForSuccess(result) : ServiceResponse.FromError<IncomeDTO>(CommonErrors.EntityNotFound);
    }

    public async Task<ServiceResponse<PagedResponse<IncomeDTO>>> GetIncomes(PaginationSearchQueryParams pagination, Guid userId, CancellationToken cancellationToken = default)
    {
        var result = await repository.PageAsync(pagination, new IncomeProjectionSpec(pagination.Search, userId), cancellationToken);
        return ServiceResponse.ForSuccess(result);
    }

    public async Task<ServiceResponse> AddIncome(IncomeAddDTO dto, Guid userId, CancellationToken cancellationToken = default)
    {
        await repository.AddAsync(new Income
        {
            Amount = dto.Amount,
            Description = dto.Description,
            Date = dto.Date,
            UserId = userId,
            CategoryId = dto.CategoryId,
            PaymentMethodId = dto.PaymentMethodId
        }, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdateIncome(IncomeUpdateDTO dto, Guid userId, CancellationToken cancellationToken = default)
    {
        var entity = await repository.GetAsync<Income>(new IncomeSpec(dto.Id, userId), cancellationToken);

        if (entity == null)
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Income not found!", ErrorCodes.EntityNotFound));

        entity.Amount = dto.Amount ?? entity.Amount;
        entity.Description = dto.Description ?? entity.Description;
        entity.Date = dto.Date ?? entity.Date;
        entity.CategoryId = dto.CategoryId ?? entity.CategoryId;
        entity.PaymentMethodId = dto.PaymentMethodId ?? entity.PaymentMethodId;

        await repository.UpdateAsync(entity, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeleteIncome(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var entity = await repository.GetAsync<Income>(new IncomeSpec(id, userId), cancellationToken);

        if (entity == null)
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Income not found!", ErrorCodes.EntityNotFound));

        await repository.DeleteAsync<Income>(id, cancellationToken);
        return ServiceResponse.ForSuccess();
    }
}
