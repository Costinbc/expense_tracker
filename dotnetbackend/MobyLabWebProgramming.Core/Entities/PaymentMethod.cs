namespace MobyLabWebProgramming.Core.Entities;

public class PaymentMethod : BaseEntity
{
    public string Name { get; set; } = null!;
    public ICollection<Expense> Expenses { get; set; } = new HashSet<Expense>();
    public ICollection<Income> Incomes { get; set; } = new HashSet<Income>();
}