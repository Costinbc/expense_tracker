using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class CategoryProjectionSpec : Specification<Category, CategoryDTO>
{
    public CategoryProjectionSpec(bool orderByName = false) =>
        Query
            .Select<Category, CategoryDTO>(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name,
                Type = c.Type
            })
            .OrderByDescending(c => c.Name, orderByName);

    public CategoryProjectionSpec(string? search) : this(true)
    {
        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim().Replace(" ", "%")}%";
            Query.Where(c => EF.Functions.ILike(c.Name, pattern));
        }
    }
}
