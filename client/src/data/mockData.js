// Mock Initial Data for 1 Gram Imitation Jewellery eCommerce System

export const INITIAL_CATEGORIES = [
  {
    id: "cat-1",
    name: "Necklace Sets",
    slug: "necklace-sets",
    description: "Royal 1 Gram Gold Polish Choker & Long Necklace Sets",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    itemCount: 14
  },
  {
    id: "cat-2",
    name: "Royal Bangles",
    slug: "bangles",
    description: "Handcrafted 1 Gram Gold Polish Kadas & Micro-Plated Bangles",
    image: "https://images.unsplash.com/photo-1611591475285-a36ad5e14391?auto=format&fit=crop&w=800&q=80",
    itemCount: 22
  },
  {
    id: "cat-3",
    name: "Temple Earrings",
    slug: "earrings",
    description: "Intricate Jhumkas, Chandbalis & Studs in 1 Gram Polish",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    itemCount: 18
  },
  {
    id: "cat-4",
    name: "Bridal Harams",
    slug: "harams",
    description: "Heavy Grand Wedding 1 Gram Polish Long Harams",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    itemCount: 9
  },
  {
    id: "cat-5",
    name: "Mangalsutras",
    slug: "mangalsutras",
    description: "Traditional Black Bead & 1 Gram Micro-plated Pendants",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    itemCount: 12
  },
  {
    id: "cat-6",
    name: "Statement Rings",
    slug: "rings",
    description: "Adjustable 1 Gram Polish Cocktail & Dailywear Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    itemCount: 15
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod-101",
    name: "Maharani Royal Temple Choker Set",
    sku: "1G-NCK-001",
    category: "Necklace Sets",
    description: "Exquisite Antique Finish 1 Gram Micro Gold Plated Choker with matching Jhumka earrings. Features goddess motif and ruby-emerald synthetic stone embellishments. High durability micro plating.",
    isImitation: true,
    material: "High-Grade Brass Base with 1 Gram Gold Polish (Imitation Jewellery - Not Real Gold)",
    weight: "85 grams",
    price: 2499,
    originalPrice: 4999,
    discountPercent: 50,
    stock: 4, // LOW STOCK TRIGGER (<= 5)
    rating: 4.8,
    reviewCount: 34,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611591475285-a36ad5e14391?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    bestSeller: true,
    newArrival: false,
    trending: true,
    reviews: [
      {
        id: "rev-1",
        userName: "Priya Sharma",
        rating: 5,
        date: "2026-07-28",
        comment: "Looks identical to real gold jewellery! The 1 gram finish has a gorgeous antique sheen. Fast delivery too."
      },
      {
        id: "rev-2",
        userName: "Ananya Roy",
        rating: 4,
        date: "2026-07-15",
        comment: "Wore it for a wedding function. Everyone mistook it for real gold! Very lightweight and comfortable."
      }
    ]
  },
  {
    id: "prod-102",
    name: "Lakshmi Peacock Bridal Long Haram",
    sku: "1G-HRM-002",
    category: "Bridal Harams",
    description: "Grand bridal long haram necklace set featuring hand-carved peacock accents in 1 Gram Micro-Plated gold finish. Complemented with premium cubic zirconia and pearl drops.",
    isImitation: true,
    material: "Copper-Brass Alloy with 1 Gram Gold Micro Plating (Imitation Jewellery - Not Real Gold)",
    weight: "140 grams",
    price: 3899,
    originalPrice: 7499,
    discountPercent: 48,
    stock: 2, // LOW STOCK TRIGGER (<= 5)
    rating: 4.9,
    reviewCount: 42,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    bestSeller: true,
    newArrival: true,
    trending: true,
    reviews: [
      {
        id: "rev-3",
        userName: "Sunita Patel",
        rating: 5,
        date: "2026-08-01",
        comment: "Outstanding craftsmanship! The weight feels balanced and the polish looks insanely rich."
      }
    ]
  },
  {
    id: "prod-103",
    name: "Antique Matt Finish Kada Bangles (Set of 4)",
    sku: "1G-BNG-003",
    category: "Royal Bangles",
    description: "Set of 4 traditional openable kadas with 1 gram matte gold finish, studded with simulated kundan stones and red enamel detailing.",
    isImitation: true,
    material: "Brass Base with 1 Gram Matt Gold Electroplating (Imitation Jewellery - Not Real Gold)",
    weight: "90 grams",
    price: 1599,
    originalPrice: 2999,
    discountPercent: 46,
    stock: 12,
    rating: 4.7,
    reviewCount: 28,
    images: [
      "https://images.unsplash.com/photo-1611591475285-a36ad5e14391?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
    ],
    featured: false,
    bestSeller: true,
    newArrival: true,
    trending: false,
    reviews: []
  },
  {
    id: "prod-104",
    name: "Traditional Temple Jhumka Earrings",
    sku: "1G-ERG-004",
    category: "Temple Earrings",
    description: "Heavy dome jhumka earrings with intricate filigree work in 1 gram gold plating. Pearl cluster drops add a majestic royal touch.",
    isImitation: true,
    material: "Copper Alloy with 1 Gram Gold Polish (Imitation Jewellery - Not Real Gold)",
    weight: "35 grams",
    price: 999,
    originalPrice: 1999,
    discountPercent: 50,
    stock: 3, // LOW STOCK TRIGGER (<= 5)
    rating: 4.6,
    reviewCount: 19,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    bestSeller: false,
    newArrival: true,
    trending: true,
    reviews: []
  },
  {
    id: "prod-105",
    name: "Classic Dual-Line Black Bead Mangalsutra",
    sku: "1G-MNG-005",
    category: "Mangalsutras",
    description: "Elegant short dual-line black bead chain featuring a 1 gram gold polish floral pendant with cz accents. Designed for everyday luxury.",
    isImitation: true,
    material: "Black Crystals & Brass Pendant with 1 Gram Micro Plating (Imitation Jewellery - Not Real Gold)",
    weight: "22 grams",
    price: 1199,
    originalPrice: 2299,
    discountPercent: 47,
    stock: 15,
    rating: 4.8,
    reviewCount: 22,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
    ],
    featured: false,
    bestSeller: true,
    newArrival: false,
    trending: false,
    reviews: []
  },
  {
    id: "prod-106",
    name: "Royal Solitaire Cocktail Ring",
    sku: "1G-RNG-006",
    category: "Statement Rings",
    description: "Statement cocktail ring with 1 gram high-shine gold polish and central emerald synthetic crystal framed by brilliant CZ stones. Adjustable band.",
    isImitation: true,
    material: "Brass Base with 1 Gram Gold Polish (Imitation Jewellery - Not Real Gold)",
    weight: "15 grams",
    price: 799,
    originalPrice: 1499,
    discountPercent: 46,
    stock: 5, // LOW STOCK TRIGGER (<= 5)
    rating: 4.5,
    reviewCount: 14,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611591475285-a36ad5e14391?auto=format&fit=crop&w=800&q=80"
    ],
    featured: false,
    bestSeller: false,
    newArrival: true,
    trending: true,
    reviews: []
  }
];

export const INITIAL_BANNERS = [
  {
    id: "banner-1",
    title: "1 Gram Royal Jewellery Collection",
    subtitle: "The Timeless Elegance of Gold • Crafted in 1 Gram Micro Plating",
    tag: "Exclusive Festive Offer",
    discountText: "Flat 50% Off Everything",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Explore 1-Gram Collection",
    buttonLink: "/products",
    active: true
  },
  {
    id: "banner-2",
    title: "Grand Bridal Harams & Chokers",
    subtitle: "Look Royal on Your Special Day with 1 Gram Antique Polish Sets",
    tag: "Wedding Edition",
    discountText: "Buy 2 Get 10% Extra Off",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Shop Bridal Harams",
    buttonLink: "/products?category=Bridal%20Harams",
    active: true
  },
  {
    id: "banner-3",
    title: "Handcrafted Micro-Plated Kadas",
    subtitle: "Durable Everyday & Special Occasion 1 Gram Bangles",
    tag: "Bestseller",
    discountText: "Starting at ₹999",
    imageUrl: "https://images.unsplash.com/photo-1611591475285-a36ad5e14391?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Browse Bangles",
    buttonLink: "/products?category=Royal%20Bangles",
    active: true
  }
];

export const INITIAL_OFFERS = [
  {
    id: "off-1",
    title: "Buy 2 Get 10% Extra Off",
    code: "BUY2GOLD10",
    minQuantity: 2,
    discountPercent: 10,
    startDate: "2026-08-01",
    endDate: "2026-12-31",
    description: "Automatic 10% discount applied when 2 or more 1-gram items are added to cart.",
    active: true
  },
  {
    id: "off-2",
    title: "Bridal Special: Buy 3 Get 15% Off",
    code: "BRIDAL15",
    minQuantity: 3,
    discountPercent: 15,
    startDate: "2026-08-01",
    endDate: "2026-12-31",
    description: "Get flat 15% off when purchasing 3 or more 1-gram jewellery products.",
    active: true
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-98421",
    userId: "usr-1",
    userName: "Rohan Verma",
    userEmail: "rohan@example.com",
    phone: "+91 98765 43210",
    items: [
      {
        id: "prod-101",
        name: "Maharani Royal Temple Choker Set",
        sku: "1G-NCK-001",
        price: 2499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
      }
    ],
    shippingAddress: {
      fullName: "Rohan Verma",
      street: "42 Golden Avenue, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
      phone: "+91 98765 43210"
    },
    subtotal: 2499,
    discount: 0,
    tax: 75,
    deliveryFee: 0,
    total: 2574,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending COD Collection",
    orderStatus: "Shipped", // Pending | Confirmed | Packed | Shipped | Delivered | Cancelled | Returned
    createdAt: "2026-08-05T10:30:00Z",
    timeline: [
      { status: "Pending", time: "2026-08-05 10:30 AM", note: "Order placed via Cash on Delivery" },
      { status: "Confirmed", time: "2026-08-05 11:15 AM", note: "Order verified by Aureate Luxe team" },
      { status: "Packed", time: "2026-08-05 03:00 PM", note: "Packed in velvet luxury box with authenticity tag" },
      { status: "Shipped", time: "2026-08-06 09:00 AM", note: "Handed to courier (AWB: DEL-99214)" }
    ]
  },
  {
    id: "ORD-98420",
    userId: "usr-2",
    userName: "Meera Nair",
    userEmail: "meera@example.com",
    phone: "+91 91234 56789",
    items: [
      {
        id: "prod-103",
        name: "Antique Matt Finish Kada Bangles (Set of 4)",
        sku: "1G-BNG-003",
        price: 1599,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1611591475285-a36ad5e14391?auto=format&fit=crop&w=800&q=80"
      }
    ],
    shippingAddress: {
      fullName: "Meera Nair",
      street: "12 Marine Drive, Nariman Point",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400021",
      phone: "+91 91234 56789"
    },
    subtotal: 3198,
    discount: 319.8, // 10% off for 2 items
    tax: 86,
    deliveryFee: 0,
    total: 2964.2,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Collected",
    orderStatus: "Delivered",
    createdAt: "2026-08-02T14:20:00Z",
    timeline: [
      { status: "Pending", time: "2026-08-02 02:20 PM", note: "Order placed" },
      { status: "Confirmed", time: "2026-08-02 03:00 PM", note: "Order confirmed" },
      { status: "Packed", time: "2026-08-02 06:00 PM", note: "Packed in velvet box" },
      { status: "Shipped", time: "2026-08-03 10:00 AM", note: "In transit" },
      { status: "Delivered", time: "2026-08-04 04:30 PM", note: "Delivered & COD Payment Received" }
    ]
  }
];

export const INITIAL_SETTINGS = {
  websiteName: "Aureate Luxe",
  logoText: "Aureate Luxe",
  slogan: "The Elegance of Gold, Accessible Luxury • 1 Gram Polish Jewellery",
  returnPolicyDays: 7,
  returnPolicyText: "Enjoy 7-Day Hassle-Free Returns & Exchange on all 1 Gram Imitation Jewellery items. Products must be unused in original luxury packaging with tags intact.",
  contactEmail: "support@aureateluxe.com",
  contactPhone: "+91 (800) 100-GOLD",
  address: "Luxury Jewellery Hub, MG Road, Bengaluru, Karnataka, India - 560001",
  cloudinaryCloudName: "aureateluxe_cloud",
  emailUser: "notifications@aureateluxe.com"
};

export const REVIEWS_DUMMY = [
  {
    id: "rev-101",
    name: "Kavita Deshmukh",
    city: "Pune",
    rating: 5,
    title: "Unbelievable quality 1 gram finish!",
    text: "I bought the Maharani choker set for my sister's sangeet. No one could tell it was 1 gram imitation jewellery! It had the perfect matte gold luster.",
    date: "August 2026",
    product: "Maharani Royal Temple Choker Set"
  },
  {
    id: "rev-102",
    name: "Deepika Rao",
    city: "Chennai",
    rating: 5,
    title: "Super fast COD delivery",
    text: "Received the Lakshmi Peacock Haram in 2 days. Velvet packaging was top notch and the 1 gram micro plating shine is brilliant.",
    date: "July 2026",
    product: "Lakshmi Peacock Bridal Long Haram"
  },
  {
    id: "rev-103",
    name: "Sneha Reddy",
    city: "Hyderabad",
    rating: 5,
    title: "1 Gram jewellery done right!",
    text: "Very transparent about being imitation 1 gram gold. Great weight, solid build, zero skin irritation.",
    date: "July 2026",
    product: "Antique Matt Finish Kada Bangles"
  }
];
