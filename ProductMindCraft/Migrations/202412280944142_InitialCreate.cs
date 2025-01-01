namespace ProductMindCraft.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Customers",
                c => new
                    {
                        CustomerId = c.Int(nullable: false, identity: true),
                        CustomerName = c.String(),
                        AadhaarNumber = c.String(),
                        Email = c.String(),
                        PhoneNumber = c.String(),
                        AddressLine1 = c.String(),
                        AddressLine2 = c.String(),
                        Country = c.String(),
                        State = c.String(),
                        Gender = c.String(),
                        CreatedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.CustomerId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Customers");
        }
    }
}
