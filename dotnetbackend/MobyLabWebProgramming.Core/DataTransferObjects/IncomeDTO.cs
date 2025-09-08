namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class IncomeDTO
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }
    public Guid CategoryId { get; set; }
    public required string CategoryName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public required string PaymentMethodName { get; set; }
    public Guid PaymentMethodId { get; set; }
}