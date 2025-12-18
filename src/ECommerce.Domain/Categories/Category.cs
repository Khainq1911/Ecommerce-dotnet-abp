using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Domain.Entities.Auditing;

namespace ECommerce.Categories
{
    public class Category : CreationAuditedAggregateRoot<Guid>
    {
        public String Name { get; set; }
        public Guid ParentId { get; set; }
    }
}
