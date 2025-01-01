namespace ProductMindCraft.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Adhar_Validation : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AdharValidations",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AadhaarNumber = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.AdharValidations");
        }
    }
}
