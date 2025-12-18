using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace ECommerce.Reviews
{
    public class Review : CreationAuditedAggregateRoot<Guid>
    {
        public Guid ProductId { get; set; }
        public Guid UserId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}
