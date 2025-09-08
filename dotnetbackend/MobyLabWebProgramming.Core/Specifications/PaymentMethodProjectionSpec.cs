using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class PaymentMethodProjectionSpec : Specification<PaymentMethod, PaymentMethodDTO>
{
    public PaymentMethodProjectionSpec(bool orderByName = false) =>
        Query.Select<PaymentMethod, PaymentMethodDTO>(p => new PaymentMethodDTO
            {
                Id = p.Id,
                Name = p.Name
            })
            .OrderByDescending(p => p.Name, orderByName);

    public PaymentMethodProjectionSpec(string? search) : this(true)
    {
        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim().Replace(" ", "%")}%";
            Query.Where(p => EF.Functions.ILike(p.Name, pattern));
        }
    }
}
