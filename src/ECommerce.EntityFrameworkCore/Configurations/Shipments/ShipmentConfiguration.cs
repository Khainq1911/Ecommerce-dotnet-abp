using ECommerce.Shipments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECommerce.Configurations.Shipments
{
    public class ShipmentConfiguration : IEntityTypeConfiguration<Shipment>
    {
        public void Configure(EntityTypeBuilder<Shipment> builder)
        {
            builder.ToTable("Shipments");
            builder.HasKey(s => s.Id);
            builder.Property(s => s.OrderId).IsRequired();
            builder.Property(s => s.ShippedAt).IsRequired();
            builder.Property(s => s.Address).HasMaxLength(500).IsRequired();
            builder.Property(s => s.Phone).HasMaxLength(20).IsRequired();
            builder.Property(s => s.Status).HasMaxLength(50).IsRequired();
            builder.Property(s => s.Shipper).HasMaxLength(100).IsRequired();
        }
    }
}
