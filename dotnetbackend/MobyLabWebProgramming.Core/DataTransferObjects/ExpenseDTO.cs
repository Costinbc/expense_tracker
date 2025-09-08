namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class ExpenseDTO
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }

    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;

    public Guid PaymentMethodId { get; set; }
    public string PaymentMethodName { get; set; } = null!;
    
    public Guid UserId { get; set; }
}