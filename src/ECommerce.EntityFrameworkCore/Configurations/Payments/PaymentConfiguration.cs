using ECommerce.Payments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECommerce.Configurations.Payments
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("Payments");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Method)
                .IsRequired()
                .HasMaxLength(100);
            builder.Property(p => p.status)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(p => p.TransactionCode)
                .IsRequired()
                .HasMaxLength(100);
            builder.Property(p => p.PaidAt)
                .IsRequired();
        }
    }
}
