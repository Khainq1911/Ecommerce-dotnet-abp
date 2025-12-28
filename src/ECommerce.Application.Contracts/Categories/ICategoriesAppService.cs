using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace ECommerce.Categories
{
    public interface ICategoriesAppService : ICrudAppService<CategoryDto, Guid>
    {

    }
}
