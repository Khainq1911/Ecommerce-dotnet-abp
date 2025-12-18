using System;
using Volo.Abp.Domain.Entities;

namespace ECommerce.Carts
{
    public class Cart : AggregateRoot<Guid>
    {
        public Guid UserId { get; set; }
    }
}
