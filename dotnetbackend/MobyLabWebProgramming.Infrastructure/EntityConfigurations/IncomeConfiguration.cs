using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Infrastructure.EntityConfigurations;

public class IncomeConfiguration : IEntityTypeConfiguration<Income>
{   
    public void Configure(EntityTypeBuilder<Income> builder)
    {
        builder.Property(i => i.Id).IsRequired();
        builder.HasKey(i => i.Id);
        builder.Property(i => i.Amount).IsRequired();
        builder.Property(i => i.Description).HasMaxLength(500);
        builder.Property(i => i.Date).IsRequired();
        builder.Property(i => i.CreatedAt).IsRequired();
        builder.Property(i => i.UpdatedAt).IsRequired();

        builder.HasOne(i => i.User)
            .WithMany()
            .HasForeignKey(i => i.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Category)
            .WithMany(c => c.Incomes)
            .HasForeignKey(i => i.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.PaymentMethod)
            .WithMany(c => c.Incomes)
            .HasForeignKey(i => i.PaymentMethodId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}