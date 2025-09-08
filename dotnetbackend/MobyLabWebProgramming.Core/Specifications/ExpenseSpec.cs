using Ardalis.Specification;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class ExpenseSpec : Specification<Expense>
{
    public ExpenseSpec(Guid expenseId, Guid userId)
    {
        Query.Where(e => e.Id == expenseId && e.UserId == userId);
    }
}