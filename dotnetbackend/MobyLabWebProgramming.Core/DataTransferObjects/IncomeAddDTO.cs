﻿namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class IncomeAddDTO
{
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }
    public Guid CategoryId { get; set; }
    public Guid PaymentMethodId { get; set; }
}