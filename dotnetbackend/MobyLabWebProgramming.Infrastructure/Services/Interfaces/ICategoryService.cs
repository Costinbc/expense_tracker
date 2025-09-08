using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

public interface ICategoryService
{
    Task<ServiceResponse<CategoryDTO>> GetCategory(Guid id, CancellationToken ct = default);
    Task<ServiceResponse<PagedResponse<CategoryDTO>>> GetCategories(PaginationSearchQueryParams pagination, CancellationToken ct = default);
    Task<ServiceResponse> AddCategory(CategoryAddDTO dto, CancellationToken ct = default);
    Task<ServiceResponse> UpdateCategory(CategoryUpdateDTO dto, CancellationToken ct = default);
    Task<ServiceResponse> DeleteCategory(Guid id, CancellationToken ct = default);
}
