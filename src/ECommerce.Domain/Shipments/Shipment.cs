using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace ECommerce.Shipments
{
    public class Shipment : CreationAuditedAggregateRoot<Guid>
    {
        public Guid OrderId { get; set; }
        public DateTime ShippedAt { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Status { get; set; }
        public string Shipper { get; set; }
    }
}
