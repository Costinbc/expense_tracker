namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class ExpenseAddDTO
{
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }
    public Guid CategoryId { get; set; }
    public Guid PaymentMethodId { get; set; }
    public Guid UserId { get; set; }
}