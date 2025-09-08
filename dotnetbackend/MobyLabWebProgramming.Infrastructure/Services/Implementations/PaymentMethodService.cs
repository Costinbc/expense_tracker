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

public class PaymentMethodService(IRepository<WebAppDatabaseContext> repository) : IPaymentMethodService
{
    public async Task<ServiceResponse<PaymentMethodDTO>> GetPaymentMethod(Guid id, CancellationToken ct = default)
    {
        var result = await repository.GetAsync<PaymentMethod, PaymentMethodDTO>(new PaymentMethodProjectionSpec(false), ct);
        return result != null
            ? ServiceResponse.ForSuccess(result)
            : ServiceResponse.FromError<PaymentMethodDTO>(CommonErrors.EntityNotFound);
    }

    public async Task<ServiceResponse<PagedResponse<PaymentMethodDTO>>> GetPaymentMethods(PaginationSearchQueryParams pagination, CancellationToken ct = default)
    {
        var result = await repository.PageAsync(pagination, new PaymentMethodProjectionSpec(pagination.Search), ct);
        return ServiceResponse.ForSuccess(result);
    }

    public async Task<ServiceResponse> AddPaymentMethod(PaymentMethodAddDTO dto, CancellationToken ct = default)
    {
        await repository.AddAsync(new PaymentMethod
        {
            Name = dto.Name
        }, ct);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdatePaymentMethod(PaymentMethodUpdateDTO dto, CancellationToken ct = default)
    {
        var method = await repository.GetAsync<PaymentMethod>(new PaymentMethodSpec(dto.Id), ct);

        if (method == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Payment method not found", ErrorCodes.EntityNotFound));
        }

        method.Name = dto.Name ?? method.Name;

        await repository.UpdateAsync(method, ct);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeletePaymentMethod(Guid id, CancellationToken ct = default)
    {
        var method = await repository.GetAsync<PaymentMethod>(new PaymentMethodSpec(id), ct);

        if (method == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Payment method not found", ErrorCodes.EntityNotFound));
        }

        await repository.DeleteAsync<PaymentMethod>(id, ct);
        return ServiceResponse.ForSuccess();
    }
}
