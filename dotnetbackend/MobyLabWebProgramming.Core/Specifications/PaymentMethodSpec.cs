using Ardalis.Specification;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class PaymentMethodSpec : Specification<PaymentMethod>
{
    public PaymentMethodSpec(Guid id)
    {
        Query.Where(p => p.Id == id);
    }
}
