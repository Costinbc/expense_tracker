using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

public interface IPaymentMethodService
{
    Task<ServiceResponse<PaymentMethodDTO>> GetPaymentMethod(Guid id, CancellationToken ct = default);
    Task<ServiceResponse<PagedResponse<PaymentMethodDTO>>> GetPaymentMethods(PaginationSearchQueryParams pagination, CancellationToken ct = default);
    Task<ServiceResponse> AddPaymentMethod(PaymentMethodAddDTO dto, CancellationToken ct = default);
    Task<ServiceResponse> UpdatePaymentMethod(PaymentMethodUpdateDTO dto, CancellationToken ct = default);
    Task<ServiceResponse> DeletePaymentMethod(Guid id, CancellationToken ct = default);
}
