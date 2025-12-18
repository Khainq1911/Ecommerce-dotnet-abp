using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace ECommerce.Products
{
    public class ProductImage : CreationAuditedEntity<Guid>
    {
        public Guid ProductId { get; set; }
        public string ImageUrl { get; set; }
        public bool isMain { get; set; }
    }
}
