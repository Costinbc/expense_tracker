using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;


public sealed class ExpenseProjectionSpec : Specification<Expense, ExpenseDTO>
{

    public ExpenseProjectionSpec(bool orderByCreatedAt = false) =>
        Query.Select(e => new()
        {
            Id = e.Id,
            UserId = e.UserId,
            Amount = e.Amount,
            Description = e.Description,
            Date = e.Date,
            CategoryId = e.CategoryId,
            CategoryName = e.Category.Name,
            PaymentMethodId = e.PaymentMethodId,
            PaymentMethodName = e.PaymentMethod.Name
        })
        .OrderByDescending(x => x.CreatedAt, orderByCreatedAt);

    public ExpenseProjectionSpec(Guid id) : this() => Query.Where(e => e.Id == id);

    public ExpenseProjectionSpec(string? search, Guid userId) : this(true)
    {
        search = !string.IsNullOrWhiteSpace(search) ? search.Trim() : null;

        Query.Where(e => e.UserId == userId);

        if (search != null)
        {
            var searchExpr = $"%{search.Replace(" ", "%")}%";
            Query.Where(i => i.Description != null && EF.Functions.ILike(i.Description, searchExpr));
        }
    }
    
    public ExpenseProjectionSpec(Guid userId, DateTime? startDate = null, DateTime? endDate = null) : this(true)
    {
        Query.Where(e => e.UserId == userId);
        
        if (startDate.HasValue)
        {
            Query.Where(e => e.Date >= startDate.Value);
        }
        
        if (endDate.HasValue)
        {
            Query.Where(e => e.Date <= endDate.Value);
        }
    }
    
    public ExpenseProjectionSpec(Guid userId, Guid categoryId) : this(true)
    {
        Query.Where(e => e.UserId == userId && e.CategoryId == categoryId);
    }
}