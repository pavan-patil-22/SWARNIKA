import Setting from '../models/Setting.js';
import GoldRateHistory from '../models/GoldRateHistory.js';

export const getSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({
        websiteName: "SWARNIKA",
        slogan: "LUXURY HERITAGE",
        returnPolicyDays: 7,
        returnPolicyText: "Enjoy Hassle-Free Returns & Exchange on all SWARNIKA 1 Gram Replica Jewellery items.",
        deliveryCharge: 99,
        freeDeliveryThreshold: 1999,
        goldRate22K: 6850,
        goldRate24K: 7470,
        goldRate18K: 5600,
        goldRateLastUpdated: new Date().toISOString().split('T')[0],
        cloudinaryCloudName: "",
        cloudinaryApiKey: "",
        cloudinaryApiSecret: "",
        emailUser: "",
        emailPass: "",
        contactEmail: "swarnika.luxury@gmail.com",
        contactPhone: "94813 04117"
      });
    }

    // Upsert initial history record if empty
    const historyCount = await GoldRateHistory.countDocuments();
    if (historyCount === 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      await GoldRateHistory.create({
        date: todayStr,
        rate22K: setting.goldRate22K || 6850,
        rate24K: setting.goldRate24K || 7470,
        rate18K: setting.goldRate18K || 5600,
        timestamp: new Date()
      });
    }

    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting(req.body);
    } else {
      if (req.body.websiteName !== undefined) setting.websiteName = req.body.websiteName;
      if (req.body.slogan !== undefined) setting.slogan = req.body.slogan;
      if (req.body.returnPolicyDays !== undefined) setting.returnPolicyDays = req.body.returnPolicyDays;
      if (req.body.returnPolicyText !== undefined) setting.returnPolicyText = req.body.returnPolicyText;
      if (req.body.deliveryCharge !== undefined) setting.deliveryCharge = req.body.deliveryCharge;
      if (req.body.freeDeliveryThreshold !== undefined) setting.freeDeliveryThreshold = req.body.freeDeliveryThreshold;
      if (req.body.goldRate22K !== undefined) setting.goldRate22K = req.body.goldRate22K;
      if (req.body.goldRate24K !== undefined) setting.goldRate24K = req.body.goldRate24K;
      if (req.body.goldRate18K !== undefined) setting.goldRate18K = req.body.goldRate18K;
      if (req.body.goldRateLastUpdated !== undefined) setting.goldRateLastUpdated = req.body.goldRateLastUpdated;
      if (req.body.cloudinaryCloudName !== undefined) setting.cloudinaryCloudName = req.body.cloudinaryCloudName;
      if (req.body.cloudinaryApiKey !== undefined) setting.cloudinaryApiKey = req.body.cloudinaryApiKey;
      if (req.body.cloudinaryApiSecret !== undefined) setting.cloudinaryApiSecret = req.body.cloudinaryApiSecret;
      if (req.body.emailUser !== undefined) setting.emailUser = req.body.emailUser;
      if (req.body.emailPass !== undefined) setting.emailPass = req.body.emailPass;
      if (req.body.contactEmail !== undefined) setting.contactEmail = req.body.contactEmail;
      if (req.body.contactPhone !== undefined) setting.contactPhone = req.body.contactPhone;
    }

    await setting.save();

    // 1. Upsert Today's Gold Rate in History
    const todayStr = setting.goldRateLastUpdated || new Date().toISOString().split('T')[0];
    await GoldRateHistory.findOneAndUpdate(
      { date: todayStr },
      {
        rate22K: setting.goldRate22K,
        rate24K: setting.goldRate24K,
        rate18K: setting.goldRate18K,
        timestamp: new Date()
      },
      { upsert: true, new: true }
    );

    // 2. Automatically Purge History Records Older Than 30 Days (Rolling 1 Month Window)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const deleteResult = await GoldRateHistory.deleteMany({ timestamp: { $lt: thirtyDaysAgo } });
    if (deleteResult.deletedCount > 0) {
      console.log(`Purged ${deleteResult.deletedCount} gold rate records older than 30 days.`);
    }

    res.json(setting);
  } catch (error) {
    console.error("Setting update error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getGoldHistory = async (req, res) => {
  try {
    // Return last 30 days history sorted chronologically
    const history = await GoldRateHistory.find()
      .sort({ timestamp: 1 })
      .limit(30);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
