using System.Net;
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

public class CategoryService(IRepository<WebAppDatabaseContext> repository) : ICategoryService
{
    public async Task<ServiceResponse<CategoryDTO>> GetCategory(Guid id, CancellationToken ct = default)
    {
        var result = await repository.GetAsync<Category, CategoryDTO>(new CategoryProjectionSpec(false), ct);
        return result != null
            ? ServiceResponse.ForSuccess(result)
            : ServiceResponse.FromError<CategoryDTO>(CommonErrors.EntityNotFound);
    }

    public async Task<ServiceResponse<PagedResponse<CategoryDTO>>> GetCategories(PaginationSearchQueryParams pagination, CancellationToken ct = default)
    {
        var result = await repository.PageAsync(pagination, new CategoryProjectionSpec(pagination.Search), ct);
        return ServiceResponse.ForSuccess(result);
    }

    public async Task<ServiceResponse> AddCategory(CategoryAddDTO dto, CancellationToken ct = default)
    {
        await repository.AddAsync(new Category
        {
            Name = dto.Name,
            Type = dto.Type
        }, ct);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdateCategory(CategoryUpdateDTO dto, CancellationToken ct = default)
    {
        var category = await repository.GetAsync<Category>(new CategorySpec(dto.Id), ct);

        if (category == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Category not found", ErrorCodes.EntityNotFound));
        }

        category.Name = dto.Name ?? category.Name;
        category.Type = dto.Type ?? category.Type;

        await repository.UpdateAsync(category, ct);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeleteCategory(Guid id, CancellationToken ct = default)
    {
        var category = await repository.GetAsync<Category>(new CategorySpec(id), ct);

        if (category == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Category not found", ErrorCodes.EntityNotFound));
        }

        await repository.DeleteAsync<Category>(id, ct);
        return ServiceResponse.ForSuccess();
    }
}
