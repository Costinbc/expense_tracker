namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;

public interface IExpenseService
{
    Task<ServiceResponse<ExpenseDTO>> GetExpense(Guid id, Guid requestingUserId, CancellationToken cancellationToken = default);
    Task<ServiceResponse<PagedResponse<ExpenseDTO>>> GetExpenses(PaginationSearchQueryParams pagination, Guid requestingUserId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> AddExpense(ExpenseAddDTO expense, Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdateExpense(ExpenseUpdateDTO expense, Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeleteExpense(Guid id, Guid userId, CancellationToken cancellationToken = default);
}