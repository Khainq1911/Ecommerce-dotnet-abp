using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Domain.Entities.Auditing;

namespace ECommerce.Payments
{
    public class Payment : CreationAuditedAggregateRoot<Guid>
    {
        public Guid OrderId { get; set; }
        public string Method { get; set; }
        public string status { get; set; }
        public string TransactionCode { get; set; }
        public DateTime PaidAt { get; set; }
    }
}
