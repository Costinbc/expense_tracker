using Ardalis.Specification;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class FeedbackSpec : Specification<Feedback>
{
    public FeedbackSpec(Guid id) => Query.Where(f => f.Id == id);
}