using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

public interface IIncomeService
{
    Task<ServiceResponse<IncomeDTO>> GetIncome(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse<PagedResponse<IncomeDTO>>> GetIncomes(PaginationSearchQueryParams pagination, Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> AddIncome(IncomeAddDTO dto, Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdateIncome(IncomeUpdateDTO dto, Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeleteIncome(Guid id, Guid userId, CancellationToken cancellationToken = default);
}
