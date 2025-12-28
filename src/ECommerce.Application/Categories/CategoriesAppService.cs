using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace ECommerce.Categories
{
    [Authorize]
    public class CategoriesAppService : CrudAppService<Category, CategoryDto, Guid>
    {
        public CategoriesAppService(IRepository<Category, Guid> repository) : base(repository)
        {
        }

    }
}
