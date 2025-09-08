using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class CategoryDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public CategoryTypeEnum Type { get; set; }
}
