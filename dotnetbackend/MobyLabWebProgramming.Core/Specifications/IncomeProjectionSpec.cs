using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class IncomeProjectionSpec : Specification<Income, IncomeDTO>
{
    public IncomeProjectionSpec(bool orderByCreatedAt = false) =>
        Query.Select<Income, IncomeDTO>(i => new IncomeDTO
        {
            Id = i.Id,
            UserId = i.UserId,
            Amount = i.Amount,
            Description = i.Description,
            Date = i.Date,
            CategoryId = i.CategoryId,
            CategoryName = i.Category.Name,
            CreatedAt = i.CreatedAt,
            UpdatedAt = i.UpdatedAt,
            PaymentMethodName = i.PaymentMethod.Name,
            PaymentMethodId = i.PaymentMethodId
        }).OrderByDescending(i => i.CreatedAt, orderByCreatedAt);

    public IncomeProjectionSpec(Guid id) : this() => Query.Where(i => i.Id == id);

    public IncomeProjectionSpec(string? search, Guid userId) : this(true)
    {
        search = !string.IsNullOrWhiteSpace(search) ? search.Trim() : null;
        Query.Where(i => i.UserId == userId);

        if (search != null)
        {
            var searchExpr = $"%{search.Replace(" ", "%")}%";
            Query.Where(i => i.Description != null && EF.Functions.ILike(i.Description, searchExpr));
        }
    }
}
