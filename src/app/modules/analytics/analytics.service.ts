import PostModel from '../posts/post.model';
import { SubscriptionModel } from '../subscription/subscription.model';
import UserModel from '../user/user.model';
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const subscriptionAnalytic = async () => {
  const subscriptionData = await SubscriptionModel.aggregate([
    {
      $group: {
        _id: {
          month: { $month: '$subscriptionStartDate' },
          year: { $year: '$subscriptionStartDate' },
        },
        monthlyCount: {
          $sum: {
            $cond: [{ $eq: ['$subscriptionType', 'monthly'] }, 1, 0],
          },
        },
        yearlyCount: {
          $sum: {
            $cond: [{ $eq: ['$subscriptionType', 'yearly'] }, 1, 0],
          },
        },
        totalRevenue: { $sum: '$price' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  //  { year: 2022, month: 6, name: "Jun", amount: 4800 },
  const subscriptionAnalytic = subscriptionData.map((payment) => ({
    name: monthNames[payment._id.month],
    month: payment._id.month ,
    year: payment._id.year,
    amount: payment.totalRevenue,
  }));
  return subscriptionAnalytic;
};

const postsAnalytic = async () => {
  const postGroupData = await PostModel.aggregate([
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        posts: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const postAnalyticData = postGroupData.map((post) => ({
    name: monthNames[post._id.month],
    posts: post.posts,
  }));

  return postAnalyticData;
};

const userAnalytic = async () => {
  const userGroupData = await UserModel.aggregate([
    { $match: { role: 'user' } },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
        },
        users: { $sum: 1 },
      },
    },
  ]);
  const userAnalytic = userGroupData.map((data) => ({
    name: monthNames[data._id.month],
    users: data.users,
  }));
  return userAnalytic;
};

const recentUserList = async () => {
  const users = await UserModel.find().sort({ createdAt: -1 }).limit(5).select('_id firstName lastName email isDeleted isVerified');
  return users;
};

const overview = async () => {
  const totalUser = await UserModel.countDocuments();
  const totalPosts = await PostModel.countDocuments();
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getMonth() - 1);
  // const totalRevenue = await SubscriptionModel.aggregate([{$group : {total: {$sum: "price"}}}])

  const startOfLastMonth = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth(),
    1,
  );

  // Set to the first day of the current month (midnight) to act as the end of the range
  const startOfThisMonth = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth() + 1,
    1,
  );
  const calculateLastMonthRevenue = await SubscriptionModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfLastMonth, // Start of last month
          $lt: startOfThisMonth, // Start of this month (exclusive)
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$price' }, // Assuming there's an 'amount' field for revenue
      },
    },
  ]);
  const calculateTotalRevenue = await SubscriptionModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$price' }, // Assuming there's an 'amount' field for revenue
      },
    },
  ]);
  const prevMonthRev = calculateLastMonthRevenue[0].totalRevenue;
  const totalRevenue = calculateTotalRevenue[0].totalRevenue;
  let revenueGrowth = 0;

  if (prevMonthRev > 0 && totalRevenue - prevMonthRev > 0) {
    revenueGrowth = (prevMonthRev / (totalRevenue - prevMonthRev)) * 100;
  }

  return {
    revenue: {
      totalRevenue: calculateTotalRevenue[0].totalRevenue,
      revenueGrowth,
    },
    user: {
      totalUser,
    },
    posts: {

      totalPosts,
    },
  };
};

export const analyticService = {
  subscriptionAnalytic,
  postsAnalytic,
  userAnalytic,
  recentUserList,
  overview,
};
