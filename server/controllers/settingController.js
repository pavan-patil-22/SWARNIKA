import Setting from '../models/Setting.js';

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
        goldRateLastUpdated: "2026-08-08",
        cloudinaryCloudName: "",
        cloudinaryApiKey: "",
        cloudinaryApiSecret: "",
        emailUser: "",
        emailPass: "",
        contactEmail: "swarnika.luxury@gmail.com",
        contactPhone: "94813 04117"
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
    console.log("Successfully updated SWARNIKA settings in MongoDB:", {
      websiteName: setting.websiteName,
      slogan: setting.slogan,
      email: setting.contactEmail,
      phone: setting.contactPhone
    });

    res.json(setting);
  } catch (error) {
    console.error("Setting update error:", error);
    res.status(500).json({ message: error.message });
  }
};
