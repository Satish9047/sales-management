const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function generateOrderReport(startDate, endDate) {
  const orders = await prisma.order.findMany({
    where: {
      order_date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      product: true,
      user: true,
    },
  });

  const orderReport = orders.map((order) => ({
    id: order.id,
    user: order.user.email,
    orderDate: order.order_date,
    product: order.product.name,
    quantity: order.quantity,
  }));

  console.log(`Order report from ${startDate} to ${endDate}:`);
  return orderReport;
}

const getDailyReport = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );
    const orderReport = await generateOrderReport(startOfDay, endOfDay);
    res.status(200).json(orderReport);
  } catch (error) {
    console.error("Error generating daily order report:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getWeeklyReport = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 7
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );
    const orderReport = await generateOrderReport(startOfWeek, endOfDay);
    res.status(200).json(orderReport);
  } catch (error) {
    console.error("Error generating weekly order report:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );
    const orderReport = await generateOrderReport(startOfMonth, endOfDay);
    res.status(200).json(orderReport);
  } catch (error) {
    console.error("Error generating monthly order report:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const generateTopSellingReport = async (req, res) => {
    const topSellings = await prisma.order.groupBy({
      by: ["productId"],
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 10,
      
      select: {
        productId: true,
        _sum: {
          select:{ quantity: true},
        },
      },
    });
  
    const showTopSelling = topSellings.map((topSelling) => ({
      productId: topSelling.productId,
      quantity: topSelling._sum.quantity,
    }));
  
    console.log(showTopSelling);
    res.status(200).json(showTopSelling);
  };

module.exports = {
  getMonthlyReport,
  getWeeklyReport,
  getDailyReport,
  generateOrderReport,
  generateTopSellingReport
};