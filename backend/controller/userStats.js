const User = require("../modals/user.modal");

//getting number of free, starter and pro subscribers
exports.getSubscriptionStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: { $toUpper: "$subscription" },
          numberofUsers: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: "Data not found",
    });
  }
};
//getting number of daily logins
exports.getDailyLogins = async (req, res, next) => {
  try {
    const now = new Date();
    //no of daily logins
    const stats = await User.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $dayOfMonth: "$lastLogin" }, now.getDate()] },
              { $eq: [{ $month: "$lastLogin" }, now.getMonth() + 1] },
              { $eq: [{ $year: "$lastLogin" }, now.getFullYear()] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          numberOfLoginsToday: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: "success",

      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: "Data not found",
    });
  }
};

//getting number of daily, monthly and weekly interviews
exports.getInterviewStats = async (req, res, next) => {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay()); // Sunday

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  try {
    const stats = await User.aggregate([
      { $unwind: "$interviewStartDates" },

      {
        $match: {
          interviewStartDates: { $gte: startOfMonth },
        },
      },

      {
        $group: {
          _id: null,
          daily: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$interviewStartDates",
                      },
                    },
                    {
                      $dateToString: { format: "%Y-%m-%d", date: startOfToday },
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          weekly: {
            $sum: {
              $cond: [{ $gte: ["$interviewStartDates", startOfWeek] }, 1, 0],
            },
          },
          monthly: {
            $sum: 1,
          },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: "Data not found",
    });
  }
};
