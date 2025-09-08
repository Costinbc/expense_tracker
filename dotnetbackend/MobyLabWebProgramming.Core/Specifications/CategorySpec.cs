using Ardalis.Specification;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class CategorySpec : Specification<Category>
{
    public CategorySpec(Guid id)
    {
        Query.Where(c => c.Id == id);
    }
}
