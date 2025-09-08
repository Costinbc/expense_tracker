using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class CategoryAddDTO
{
    public string Name { get; set; } = null!;
    public CategoryTypeEnum Type { get; set; }
}
