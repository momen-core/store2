/**
 * FAYONKA - فيونكة
 * Database Layer (localStorage)
 * Manages all data operations
 */

const DB = {
  // ============================================
  // INITIALIZATION
  // ============================================
  init() {
    if (!localStorage.getItem('fayonka_initialized')) {
      this.seed();
      localStorage.setItem('fayonka_initialized', '1');
    } else {
      // Temporary migration: inject the moderator account if it doesn't exist
      const admins = this.get('admins') || [];
      if (!admins.find(a => a.username === 'moderator')) {
        admins.push({
          id: 'a2', username: 'moderator', password: this.hashPassword('123456'),
          name: 'مشرف الطلبات', email: 'mod@fayonka.com',
          role: 'admin', avatar: null, recoveryCode: '',
          permissions: ['orders', 'products'],
          active: true, lastLogin: null, createdAt: '2024-01-02'
        });
        this.set('admins', admins);
      }

      // Temporary migration: ensure announcement settings exist
      const settings = this.get('settings') || {};
      if (!settings.announcement) {
        settings.announcement = { active: true, text: '🎀 شحن مجاني على الطلبات فوق 2000 جنيه', bgColor: '#1A1A1A', textColor: '#FFFFFF' };
        this.set('settings', settings);
      }
    }
  },

  seed() {
    // Seed Categories
    const categories = [
      { id: 'c1', name: 'ملابس', nameEn: 'Clothing', slug: 'clothing', icon: '👗', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80', productsCount: 0, hasSize: true, hasColor: true, active: true, order: 1 },
      { id: 'c2', name: 'أحذية', nameEn: 'Shoes', slug: 'shoes', icon: '👠', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80', productsCount: 0, hasSize: true, sizeType: 'shoe', hasColor: true, active: true, order: 2 },
      { id: 'c3', name: 'إكسسوارات', nameEn: 'Accessories', slug: 'accessories', icon: '💍', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80', productsCount: 0, hasSize: false, hasColor: true, active: true, order: 3 },
      { id: 'c4', name: 'حقائب', nameEn: 'Bags', slug: 'bags', icon: '👜', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', productsCount: 0, hasSize: false, hasColor: true, active: true, order: 4 },
      { id: 'c5', name: 'عطور', nameEn: 'Perfumes', slug: 'perfumes', icon: '🌺', image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80', productsCount: 0, hasSize: true, sizeType: 'perfume', hasColor: false, active: true, order: 5 },
      { id: 'c6', name: 'مستحضرات التجميل', nameEn: 'Beauty', slug: 'beauty', icon: '💄', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80', productsCount: 0, hasSize: false, hasColor: false, active: true, order: 6 },
    ];
    this.set('categories', categories);

    // Seed Products
    const products = [
      // CLOTHING
      {
        id: 'p1', categoryId: 'c1', category: 'ملابس',
        name: 'فستان سواريه ذهبي أنيق', nameEn: 'Elegant Gold Evening Dress',
        description: 'فستان سواريه فاخر بتصميم أنيق ومتميز. مصنوع من أجود أنواع الأقمشة التي تمنحك إطلالة ساحرة في المناسبات الرسمية والحفلات. يتميز بقصته الجميلة التي تبرز رشاقتك وأناقتك.',
        price: 1200, salePrice: 899, discount: 25,
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
          'https://images.unsplash.com/photo-1589810264340-0ce2b6a7dd0f?w=600&q=80',
          'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80'
        ],
        hasSize: true, hasColor: true,
        sizes: [
          { id: 's1', name: 'XS', qty: 3 }, { id: 's2', name: 'S', qty: 8 },
          { id: 's3', name: 'M', qty: 12 }, { id: 's4', name: 'L', qty: 5 },
          { id: 's5', name: 'XL', qty: 2 }, { id: 's6', name: 'XXL', qty: 0 }
        ],
        colors: [
          { id: 'col1', name: 'ذهبي', nameEn: 'Gold', hex: '#C8A882', qty: 15, image: null },
          { id: 'col2', name: 'أسود', nameEn: 'Black', hex: '#1A1A1A', qty: 10, image: null },
          { id: 'col3', name: 'أبيض', nameEn: 'White', hex: '#F5F5F5', qty: 5, image: null }
        ],
        qty: 30, sku: 'DRS-001', weight: 0.5, brand: 'فيونكة',
        tags: ['فستان', 'سواريه', 'ملابس نسائية', 'مناسبات'],
        featured: true, isNew: true, isBestSeller: true,
        rating: 4.8, reviewsCount: 45, salesCount: 124,
        active: true, createdAt: '2025-01-01', updatedAt: '2025-01-01'
      },
      {
        id: 'p2', categoryId: 'c1', category: 'ملابس',
        name: 'بلوزة كاجوال أنيقة', nameEn: 'Elegant Casual Blouse',
        description: 'بلوزة عصرية بتصميم متميز تناسب كل المناسبات. خامة ناعمة ومريحة مع تطريز راقٍ.',
        price: 350, salePrice: 280, discount: 20,
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'],
        hasSize: true, hasColor: true,
        sizes: [
          { id: 's1', name: 'S', qty: 10 }, { id: 's2', name: 'M', qty: 15 },
          { id: 's3', name: 'L', qty: 8 }, { id: 's4', name: 'XL', qty: 4 }
        ],
        colors: [
          { id: 'col1', name: 'وردي', nameEn: 'Pink', hex: '#F9A8D4', qty: 20, image: null },
          { id: 'col2', name: 'أبيض', nameEn: 'White', hex: '#FFFFFF', qty: 17, image: null }
        ],
        qty: 37, sku: 'BLS-002', weight: 0.3, brand: 'فيونكة',
        tags: ['بلوزة', 'كاجوال', 'يومي'],
        featured: false, isNew: true, isBestSeller: false,
        rating: 4.5, reviewsCount: 28, salesCount: 67,
        active: true, createdAt: '2025-01-05', updatedAt: '2025-01-05'
      },
      {
        id: 'p3', categoryId: 'c1', category: 'ملابس',
        name: 'عباية فاخرة مطرزة', nameEn: 'Luxury Embroidered Abaya',
        description: 'عباية فاخرة بتطريز يدوي دقيق تعكس أناقة المرأة العربية. تصميم راقٍ بتفاصيل مميزة.',
        price: 850, salePrice: 850, discount: 0,
        images: [
          'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&q=80',
          'https://images.unsplash.com/photo-1594938298603-c8148c4b4ae8?w=600&q=80'
        ],
        hasSize: true, hasColor: true,
        sizes: [
          { id: 's1', name: '52', qty: 5 }, { id: 's2', name: '54', qty: 8 },
          { id: 's3', name: '56', qty: 10 }, { id: 's4', name: '58', qty: 6 }, { id: 's5', name: '60', qty: 3 }
        ],
        colors: [
          { id: 'col1', name: 'أسود', nameEn: 'Black', hex: '#1A1A1A', qty: 20, image: null },
          { id: 'col2', name: 'كحلي', nameEn: 'Navy', hex: '#1B2B4B', qty: 12, image: null }
        ],
        qty: 32, sku: 'ABY-003', weight: 0.8, brand: 'فيونكة',
        tags: ['عباية', 'فاخرة', 'مطرزة', 'محجبات'],
        featured: true, isNew: false, isBestSeller: true,
        rating: 4.9, reviewsCount: 63, salesCount: 189,
        active: true, createdAt: '2024-12-01', updatedAt: '2024-12-01'
      },
      // SHOES
      {
        id: 'p4', categoryId: 'c2', category: 'أحذية',
        name: 'حذاء كعب عالٍ مخملي', nameEn: 'Velvet High Heel',
        description: 'حذاء كعب عالٍ فاخر بخامة مخملية ناعمة. تصميم راقٍ يضفي أناقة استثنائية على إطلالتك.',
        price: 600, salePrice: 450, discount: 25,
        images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80'],
        hasSize: true, sizeType: 'shoe', hasColor: true,
        sizes: [
          { id: 's1', name: '36', qty: 4 }, { id: 's2', name: '37', qty: 8 },
          { id: 's3', name: '38', qty: 10 }, { id: 's4', name: '39', qty: 7 },
          { id: 's5', name: '40', qty: 3 }, { id: 's6', name: '41', qty: 2 }
        ],
        colors: [
          { id: 'col1', name: 'بردو', nameEn: 'Burgundy', hex: '#800020', qty: 18, image: null },
          { id: 'col2', name: 'أسود', nameEn: 'Black', hex: '#1A1A1A', qty: 16, image: null }
        ],
        qty: 34, sku: 'SHO-004', weight: 0.9, brand: 'فيونكة',
        tags: ['حذاء', 'كعب عالي', 'مخمل', 'احتفالي'],
        featured: true, isNew: false, isBestSeller: true,
        rating: 4.7, reviewsCount: 52, salesCount: 143,
        active: true, createdAt: '2024-11-15', updatedAt: '2024-11-15'
      },
      {
        id: 'p5', categoryId: 'c2', category: 'أحذية',
        name: 'صندل مرصع بالكريستال', nameEn: 'Crystal Embellished Sandal',
        description: 'صندل أنيق مرصع بالكريستالات اللامعة. مثالي للسهرات والمناسبات الخاصة.',
        price: 420, salePrice: 350, discount: 17,
        images: ['https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80'],
        hasSize: true, sizeType: 'shoe', hasColor: false,
        sizes: [
          { id: 's1', name: '36', qty: 6 }, { id: 's2', name: '37', qty: 9 },
          { id: 's3', name: '38', qty: 11 }, { id: 's4', name: '39', qty: 8 }, { id: 's5', name: '40', qty: 4 }
        ],
        colors: [],
        qty: 38, sku: 'SAN-005', weight: 0.5, brand: 'فيونكة',
        tags: ['صندل', 'كريستال', 'سهرة'],
        featured: false, isNew: true, isBestSeller: false,
        rating: 4.4, reviewsCount: 21, salesCount: 42,
        active: true, createdAt: '2025-01-08', updatedAt: '2025-01-08'
      },
      // ACCESSORIES
      {
        id: 'p6', categoryId: 'c3', category: 'إكسسوارات',
        name: 'طقم مجوهرات ذهبي', nameEn: 'Gold Jewelry Set',
        description: 'طقم مجوهرات فاخر من الذهب المطلي يشمل عقد وأساور وأقراط. تصميم كلاسيكي أنيق.',
        price: 550, salePrice: 450, discount: 18,
        images: [
          'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80'
        ],
        hasSize: false, hasColor: false,
        sizes: [], colors: [],
        qty: 25, sku: 'JWL-006', weight: 0.1, brand: 'فيونكة',
        tags: ['مجوهرات', 'ذهب', 'طقم', 'هدية'],
        featured: true, isNew: false, isBestSeller: true,
        rating: 4.9, reviewsCount: 78, salesCount: 210,
        active: true, createdAt: '2024-10-01', updatedAt: '2024-10-01'
      },
      {
        id: 'p7', categoryId: 'c3', category: 'إكسسوارات',
        name: 'ساعة يد عصرية', nameEn: 'Modern Wristwatch',
        description: 'ساعة يد أنيقة بتصميم عصري مع سوار جلدي فاخر. مقاومة للماء ومتعددة الوظائف.',
        price: 800, salePrice: 650, discount: 19,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
        hasSize: false, hasColor: true,
        sizes: [],
        colors: [
          { id: 'col1', name: 'ذهبي', nameEn: 'Gold', hex: '#C8A882', qty: 10, image: null },
          { id: 'col2', name: 'فضي', nameEn: 'Silver', hex: '#C0C0C0', qty: 8, image: null },
          { id: 'col3', name: 'روز جولد', nameEn: 'Rose Gold', hex: '#B76E79', qty: 6, image: null }
        ],
        qty: 24, sku: 'WTC-007', weight: 0.2, brand: 'فيونكة',
        tags: ['ساعة', 'يد', 'هدية', 'فاخر'],
        featured: false, isNew: true, isBestSeller: false,
        rating: 4.6, reviewsCount: 34, salesCount: 88,
        active: true, createdAt: '2025-01-03', updatedAt: '2025-01-03'
      },
      // BAGS
      {
        id: 'p8', categoryId: 'c4', category: 'حقائب',
        name: 'حقيبة يد جلدية فاخرة', nameEn: 'Luxury Leather Handbag',
        description: 'حقيبة يد من الجلد الإيطالي الأصلي الفاخر. مع حجرات منظمة وحزام قابل للتعديل.',
        price: 1500, salePrice: 1200, discount: 20,
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80'
        ],
        hasSize: false, hasColor: true,
        sizes: [],
        colors: [
          { id: 'col1', name: 'بني كاراميل', nameEn: 'Caramel', hex: '#C19A6B', qty: 8, image: null },
          { id: 'col2', name: 'أسود', nameEn: 'Black', hex: '#1A1A1A', qty: 12, image: null },
          { id: 'col3', name: 'بيج', nameEn: 'Beige', hex: '#F5DEB3', qty: 5, image: null }
        ],
        qty: 25, sku: 'BAG-008', weight: 0.7, brand: 'فيونكة',
        tags: ['حقيبة', 'جلد', 'فاخر', 'يد'],
        featured: true, isNew: false, isBestSeller: true,
        rating: 4.8, reviewsCount: 91, salesCount: 267,
        active: true, createdAt: '2024-09-01', updatedAt: '2024-09-01'
      },
      {
        id: 'p9', categoryId: 'c4', category: 'حقائب',
        name: 'حقيبة ظهر كاجوال', nameEn: 'Casual Backpack',
        description: 'حقيبة ظهر عصرية وعملية مناسبة للعمل والسفر. مع حجرات متعددة وخامة مقاومة للماء.',
        price: 450, salePrice: 380, discount: 16,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'],
        hasSize: false, hasColor: true,
        sizes: [],
        colors: [
          { id: 'col1', name: 'رمادي', nameEn: 'Gray', hex: '#808080', qty: 15, image: null },
          { id: 'col2', name: 'أسود', nameEn: 'Black', hex: '#1A1A1A', qty: 20, image: null },
          { id: 'col3', name: 'كاكي', nameEn: 'Khaki', hex: '#C3B091', qty: 10, image: null }
        ],
        qty: 45, sku: 'BAG-009', weight: 0.5, brand: 'فيونكة',
        tags: ['حقيبة', 'ظهر', 'كاجوال', 'سفر'],
        featured: false, isNew: false, isBestSeller: false,
        rating: 4.3, reviewsCount: 19, salesCount: 55,
        active: true, createdAt: '2024-12-10', updatedAt: '2024-12-10'
      },
      // PERFUMES
      {
        id: 'p10', categoryId: 'c5', category: 'عطور',
        name: 'عطر رحيق الورد', nameEn: 'Rose Nectar Perfume',
        description: 'عطر فاخر بعبق الورد الدمشقي الأصيل. خليط مميز من رائحة الورد والمسك والعود. يدوم طويلاً.',
        price: 380, salePrice: 320, discount: 16,
        images: [
          'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80',
          'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80'
        ],
        hasSize: true, sizeType: 'perfume', hasColor: false,
        sizes: [
          { id: 's1', name: '30ml', qty: 10 }, { id: 's2', name: '50ml', qty: 15 },
          { id: 's3', name: '100ml', qty: 8 }
        ],
        colors: [],
        qty: 33, sku: 'PRF-010', weight: 0.3, brand: 'فيونكة',
        tags: ['عطر', 'ورد', 'نسائي', 'فاخر'],
        featured: true, isNew: false, isBestSeller: true,
        rating: 4.9, reviewsCount: 112, salesCount: 334,
        active: true, createdAt: '2024-08-01', updatedAt: '2024-08-01'
      },
      {
        id: 'p11', categoryId: 'c5', category: 'عطور',
        name: 'عطر عود الليل', nameEn: 'Oud Night Perfume',
        description: 'عطر شرقي فاخر بعبق العود الأصيل والمسك الأبيض. تركيبة مميزة تدوم أكثر من 24 ساعة.',
        price: 650, salePrice: 550, discount: 15,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80'],
        hasSize: true, sizeType: 'perfume', hasColor: false,
        sizes: [
          { id: 's1', name: '50ml', qty: 12 }, { id: 's2', name: '100ml', qty: 10 }, { id: 's3', name: '200ml', qty: 5 }
        ],
        colors: [],
        qty: 27, sku: 'PRF-011', weight: 0.4, brand: 'فيونكة',
        tags: ['عطر', 'عود', 'شرقي', 'مسك'],
        featured: false, isNew: true, isBestSeller: false,
        rating: 4.7, reviewsCount: 56, salesCount: 145,
        active: true, createdAt: '2025-01-02', updatedAt: '2025-01-02'
      },
      // BEAUTY
      {
        id: 'p12', categoryId: 'c6', category: 'مستحضرات التجميل',
        name: 'مجموعة العناية بالبشرة', nameEn: 'Skincare Collection',
        description: 'مجموعة متكاملة للعناية بالبشرة تشمل غسول، تونر، سيروم، وكريم ترطيب. لبشرة مشرقة وحيوية.',
        price: 520, salePrice: 420, discount: 19,
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80'
        ],
        hasSize: false, hasColor: false,
        sizes: [], colors: [],
        qty: 40, sku: 'SKN-012', weight: 1.2, brand: 'فيونكة',
        tags: ['بشرة', 'عناية', 'سيروم', 'مجموعة'],
        featured: true, isNew: false, isBestSeller: true,
        rating: 4.8, reviewsCount: 87, salesCount: 256,
        active: true, createdAt: '2024-07-01', updatedAt: '2024-07-01'
      },
      {
        id: 'p13', categoryId: 'c6', category: 'مستحضرات التجميل',
        name: 'احمر شفاه مخملي مستدام', nameEn: 'Velvet Long-lasting Lipstick',
        description: 'أحمر شفاه بتركيبة مخملية مستدامة تدوم حتى 16 ساعة. لون غني ومشبع يبرز جمال شفتيك.',
        price: 180, salePrice: 150, discount: 17,
        images: ['https://images.unsplash.com/photo-1586495777744-4e6232bf2882?w=600&q=80'],
        hasSize: false, hasColor: true,
        sizes: [],
        colors: [
          { id: 'col1', name: 'أحمر كلاسيك', nameEn: 'Classic Red', hex: '#C41E3A', qty: 20, image: null },
          { id: 'col2', name: 'وردي فاتح', nameEn: 'Blush Pink', hex: '#FFB6C1', qty: 15, image: null },
          { id: 'col3', name: 'بردو', nameEn: 'Burgundy', hex: '#800020', qty: 18, image: null },
          { id: 'col4', name: 'نود', nameEn: 'Nude', hex: '#D4956A', qty: 22, image: null }
        ],
        qty: 75, sku: 'LPS-013', weight: 0.05, brand: 'فيونكة',
        tags: ['أحمر شفاه', 'مكياج', 'مستدام', 'مخملي'],
        featured: false, isNew: true, isBestSeller: false,
        rating: 4.5, reviewsCount: 44, salesCount: 178,
        active: true, createdAt: '2025-01-06', updatedAt: '2025-01-06'
      },
      {
        id: 'p14', categoryId: 'c1', category: 'ملابس',
        name: 'بدلة بيت أنيقة', nameEn: 'Elegant Home Suit',
        description: 'بدلة بيت فاخرة من قماش الساتان الناعم. تصميم أنيق ومريح للاستخدام اليومي في المنزل.',
        price: 320, salePrice: 260, discount: 19,
        images: ['https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80'],
        hasSize: true, hasColor: true,
        sizes: [
          { id: 's1', name: 'S', qty: 8 }, { id: 's2', name: 'M', qty: 12 },
          { id: 's3', name: 'L', qty: 10 }, { id: 's4', name: 'XL', qty: 6 }
        ],
        colors: [
          { id: 'col1', name: 'بيج', nameEn: 'Beige', hex: '#F5DEB3', qty: 18, image: null },
          { id: 'col2', name: 'وردي', nameEn: 'Pink', hex: '#F9A8D4', qty: 18, image: null }
        ],
        qty: 36, sku: 'HOM-014', weight: 0.4, brand: 'فيونكة',
        tags: ['بدلة', 'بيت', 'ناعم', 'يومي'],
        featured: false, isNew: false, isBestSeller: false,
        rating: 4.3, reviewsCount: 27, salesCount: 72,
        active: true, createdAt: '2024-11-20', updatedAt: '2024-11-20'
      },
      {
        id: 'p15', categoryId: 'c3', category: 'إكسسوارات',
        name: 'طوق مرصع باللؤلؤ', nameEn: 'Pearl Embellished Choker',
        description: 'طوق فاخر مرصع باللؤلؤ الطبيعي. قطعة فريدة تضيف لمسة من الأناقة لأي إطلالة.',
        price: 280, salePrice: 220, discount: 21,
        images: ['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80'],
        hasSize: false, hasColor: false,
        sizes: [], colors: [],
        qty: 18, sku: 'ACC-015', weight: 0.05, brand: 'فيونكة',
        tags: ['طوق', 'لؤلؤ', 'مجوهرات', 'هدية'],
        featured: false, isNew: true, isBestSeller: false,
        rating: 4.6, reviewsCount: 16, salesCount: 38,
        active: true, createdAt: '2025-01-09', updatedAt: '2025-01-09'
      },
      {
        id: 'p16', categoryId: 'c2', category: 'أحذية',
        name: 'حذاء رياضي شيك', nameEn: 'Chic Sneakers',
        description: 'حذاء رياضي عصري بتصميم أنيق. مريح للغاية ومناسب لأوقات الفراغ والتسوق.',
        price: 380, salePrice: 310, discount: 18,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
        hasSize: true, sizeType: 'shoe', hasColor: true,
        sizes: [
          { id: 's1', name: '36', qty: 5 }, { id: 's2', name: '37', qty: 8 },
          { id: 's3', name: '38', qty: 10 }, { id: 's4', name: '39', qty: 9 }, { id: 's5', name: '40', qty: 6 }
        ],
        colors: [
          { id: 'col1', name: 'أبيض', nameEn: 'White', hex: '#FFFFFF', qty: 20, image: null },
          { id: 'col2', name: 'أسود', nameEn: 'Black', hex: '#1A1A1A', qty: 18, image: null }
        ],
        qty: 38, sku: 'SNK-016', weight: 0.7, brand: 'فيونكة',
        tags: ['حذاء', 'رياضي', 'كاجوال', 'مريح'],
        featured: false, isNew: false, isBestSeller: true,
        rating: 4.4, reviewsCount: 39, salesCount: 103,
        active: true, createdAt: '2024-10-15', updatedAt: '2024-10-15'
      }
    ];
    this.set('products', products);

    // Update category product counts
    const updatedCats = categories.map(cat => ({
      ...cat,
      productsCount: products.filter(p => p.categoryId === cat.id && p.active).length
    }));
    this.set('categories', updatedCats);

    // Seed Admins
    const admins = [
      {
        id: 'a1', username: 'admin', password: this.hashPassword('fayonka2024'),
        name: 'المدير العام (المالك)', email: 'admin@fayonka.com',
        role: 'owner', avatar: null, recoveryCode: '794',
        permissions: ['all'],
        active: true, lastLogin: null, createdAt: '2024-01-01'
      },
      {
        id: 'a2', username: 'moderator', password: this.hashPassword('123456'),
        name: 'مشرف الطلبات', email: 'mod@fayonka.com',
        role: 'admin', avatar: null, recoveryCode: '',
        permissions: ['orders', 'products'],
        active: true, lastLogin: null, createdAt: '2024-01-02'
      }
    ];
    this.set('admins', admins);

    // Seed Shipping
    const shipping = {
      baseRate: 60,
      freeShippingThreshold: 2000,
      governorates: [
        { id: 'g1', name: 'القاهرة', rate: 50 },
        { id: 'g2', name: 'الجيزة', rate: 55 },
        { id: 'g3', name: 'الإسكندرية', rate: 70 },
        { id: 'g4', name: 'الشرقية', rate: 65 },
        { id: 'g5', name: 'الغربية', rate: 65 },
        { id: 'g6', name: 'المنوفية', rate: 60 },
        { id: 'g7', name: 'القليوبية', rate: 55 },
        { id: 'g8', name: 'البحيرة', rate: 70 },
        { id: 'g9', name: 'الدقهلية', rate: 65 },
        { id: 'g10', name: 'كفر الشيخ', rate: 70 },
        { id: 'g11', name: 'الفيوم', rate: 70 },
        { id: 'g12', name: 'بني سويف', rate: 75 },
        { id: 'g13', name: 'المنيا', rate: 80 },
        { id: 'g14', name: 'أسيوط', rate: 85 },
        { id: 'g15', name: 'سوهاج', rate: 90 },
        { id: 'g16', name: 'قنا', rate: 90 },
        { id: 'g17', name: 'الأقصر', rate: 95 },
        { id: 'g18', name: 'أسوان', rate: 100 },
        { id: 'g19', name: 'البحر الأحمر', rate: 100 },
        { id: 'g20', name: 'جنوب سيناء', rate: 110 },
        { id: 'g21', name: 'شمال سيناء', rate: 110 },
        { id: 'g22', name: 'السويس', rate: 80 },
        { id: 'g23', name: 'الإسماعيلية', rate: 75 },
        { id: 'g24', name: 'بورسعيد', rate: 80 },
        { id: 'g25', name: 'مطروح', rate: 120 },
        { id: 'g26', name: 'الوادي الجديد', rate: 130 },
        { id: 'g27', name: 'دمياط', rate: 70 },
      ]
    };
    this.set('shipping', shipping);

    // Seed Coupons
    const coupons = [
      {
        id: 'cp1', code: 'WELCOME20', type: 'percentage', value: 20,
        minOrder: 500, maxDiscount: 200, usageLimit: 100, usedCount: 23,
        expiresAt: '2025-12-31', active: true, createdAt: '2024-01-01'
      },
      {
        id: 'cp2', code: 'SAVE100', type: 'fixed', value: 100,
        minOrder: 800, maxDiscount: null, usageLimit: 50, usedCount: 12,
        expiresAt: '2025-06-30', active: true, createdAt: '2024-01-01'
      }
    ];
    this.set('coupons', coupons);

    // Seed Banners
    const banners = [
      {
        id: 'b1', title: 'كولكشن الصيف 2025', subtitle: 'خصومات تصل إلى 50%',
        description: 'اكتشفي أحدث صيحات الموضة لموسم الصيف',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80',
        link: 'products.html?category=clothing',
        ctaText: 'تسوقي الآن', ctaTextEn: 'Shop Now',
        bgColor: '#1A1A1A', active: true, order: 1
      },
      {
        id: 'b2', title: 'العطور الفاخرة', subtitle: 'رائحتك هي بطاقة تعريفك',
        description: 'مجموعة مختارة من أرقى عطور العالم',
        image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=1200&q=80',
        link: 'products.html?category=perfumes',
        ctaText: 'اكتشفي المجموعة', ctaTextEn: 'Explore Collection',
        bgColor: '#2D1B0E', active: true, order: 2
      },
      {
        id: 'b3', title: 'إكسسوارات تكمل أناقتك', subtitle: 'التفاصيل هي الفرق',
        description: 'حقائب ومجوهرات تضفي لمسة من الفخامة',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4ae8?w=1200&q=80',
        link: 'products.html',
        ctaText: 'تصفحي المجموعة', ctaTextEn: 'Browse Collection',
        bgColor: '#0A1628', active: true, order: 3
      }
    ];
    this.set('banners', banners);

    // Seed Sample Orders
    const orders = [
      {
        id: 'ORD-001', orderNumber: 'ORD-001',
        items: [{ productId: 'p1', name: 'فستان سواريه ذهبي', qty: 1, price: 899, size: 'M', color: 'ذهبي' }],
        customer: { name: 'سارة محمد', phone: '0501234567', whatsapp: '0501234567', altPhone: null, governorate: 'القاهرة', city: 'مدينة نصر', address: 'شارع 9، بلوك أ', landmark: 'جوار مترو' },
        subtotal: 899, shippingCost: 50, discount: 0, coupon: null, total: 949,
        status: 'delivered', paymentMethod: 'cod', notes: '',
        createdAt: '2025-01-05T10:30:00', updatedAt: '2025-01-08T15:00:00'
      },
      {
        id: 'ORD-002', orderNumber: 'ORD-002',
        items: [
          { productId: 'p10', name: 'عطر رحيق الورد', qty: 2, price: 320, size: '50ml', color: null },
          { productId: 'p6', name: 'طقم مجوهرات ذهبي', qty: 1, price: 450, size: null, color: null }
        ],
        customer: { name: 'منى أحمد', phone: '0512345678', whatsapp: '0512345678', altPhone: '0523456789', governorate: 'الإسكندرية', city: 'سموحة', address: 'شارع الميدان رقم 12', landmark: 'أمام البنك' },
        subtotal: 1090, shippingCost: 70, discount: 218, coupon: 'WELCOME20', total: 942,
        status: 'shipped', paymentMethod: 'cod', notes: 'يرجى التغليف الجميل',
        createdAt: '2025-01-08T14:00:00', updatedAt: '2025-01-09T09:00:00'
      },
      {
        id: 'ORD-003', orderNumber: 'ORD-003',
        items: [{ productId: 'p8', name: 'حقيبة يد جلدية فاخرة', qty: 1, price: 1200, size: null, color: 'أسود' }],
        customer: { name: 'ريم خالد', phone: '0534567890', whatsapp: '0534567890', altPhone: null, governorate: 'الرياض', city: 'العليا', address: 'برج الفيصل، الطابق 3', landmark: 'بجوار مطعم' },
        subtotal: 1200, shippingCost: 55, discount: 0, coupon: null, total: 1255,
        status: 'processing', paymentMethod: 'cod', notes: '',
        createdAt: '2025-01-09T09:00:00', updatedAt: '2025-01-09T09:00:00'
      }
    ];
    this.set('orders', orders);

    // Seed Reviews
    const reviews = [
      { id: 'r1', productId: 'p1', name: 'سارة م.', rating: 5, comment: 'فستان جميل جداً والخامة ممتازة، استلمته بحالة ممتازة وأنصح بيه', date: '2025-01-06', approved: true },
      { id: 'r2', productId: 'p1', name: 'نور ع.', rating: 5, comment: 'تصميم رائع وجودة عالية! استلمته سريع وكان مطابق للصور', date: '2025-01-07', approved: true },
      { id: 'r3', productId: 'p1', name: 'هبة ك.', rating: 4, comment: 'ممتاز بس المقاس جاء أكبر شوية، بس شكله حلو', date: '2025-01-08', approved: true },
      { id: 'r4', productId: 'p10', name: 'منى ر.', rating: 5, comment: 'عطر فاخر جداً وريحته تدوم طول اليوم! راضية جداً', date: '2025-01-04', approved: true },
      { id: 'r5', productId: 'p8', name: 'ريم ل.', rating: 5, comment: 'حقيبة فخامتها عالية جداً، جلد طبيعي ومعمولها كويس', date: '2024-12-28', approved: true },
      { id: 'r6', productId: 'p6', name: 'دينا م.', rating: 5, comment: 'طقم المجوهرات ذوق رفيع، هدية مثالية', date: '2024-12-20', approved: true },
      { id: 'r7', productId: 'p3', name: 'أميرة س.', rating: 5, comment: 'العباية تحفة، التطريز شغل يدوي دقيق وجميل جداً', date: '2024-12-15', approved: true },
    ];
    this.set('reviews', reviews);

    // Seed Activity Log
    this.set('activityLog', [
      { id: 'l1', adminId: 'a1', adminName: 'المدير العام', action: 'create', entity: 'product', entityId: 'p1', details: 'إضافة منتج: فستان سواريه ذهبي', at: '2024-01-01T12:00:00' }
    ]);

    // Initialize cart & wishlist
    this.set('cart', []);
    this.set('wishlist', []);
    this.set('settings', {
      storeName: 'فيونكة', storeNameEn: 'Fayonka',
      logo: null, tagline: 'أناقة بلا حدود', taglineEn: 'Elegance Without Limits',
      email: 'info@fayonka.com', phone: '0100000000',
      whatsapp: '0100000000',
      instagram: '#', facebook: '#', tiktok: '#',
      developer: 'AlSaad', developerUrl: '#',
      lowStockThreshold: 5,
      announcement: {
        active: true,
        text: '🎀 شحن مجاني على الطلبات فوق 2000 جنيه',
        bgColor: '#1A1A1A',
        textColor: '#FFFFFF'
      }
    });
  },

  // ============================================
  // CORE OPERATIONS
  // ============================================
  get(key) {
    try {
      const data = localStorage.getItem(`fayonka_${key}`);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  set(key, value) {
    try {
      localStorage.setItem(`fayonka_${key}`, JSON.stringify(value));
      return true;
    } catch { return false; }
  },

  // ============================================
  // PRODUCTS
  // ============================================
  getProducts(filters = {}) {
    let products = this.get('products') || [];
    if (filters.active !== undefined) products = products.filter(p => p.active === filters.active);
    if (filters.categoryId) products = products.filter(p => p.categoryId === filters.categoryId);
    if (filters.featured) products = products.filter(p => p.featured);
    if (filters.isNew) products = products.filter(p => p.isNew);
    if (filters.isBestSeller) products = products.filter(p => p.isBestSeller);
    if (filters.onSale) products = products.filter(p => p.discount > 0);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        p.category.includes(q)
      );
    }
    if (filters.minPrice !== undefined) products = products.filter(p => (p.salePrice || p.price) >= filters.minPrice);
    if (filters.maxPrice !== undefined) products = products.filter(p => (p.salePrice || p.price) <= filters.maxPrice);

    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc': products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
        case 'price_desc': products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
        case 'newest': products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
        case 'best_selling': products.sort((a, b) => b.salesCount - a.salesCount); break;
        case 'top_rated': products.sort((a, b) => b.rating - a.rating); break;
      }
    }

    if (filters.limit) products = products.slice(0, filters.limit);
    return products;
  },

  getProductById(id) {
    return (this.get('products') || []).find(p => p.id === id);
  },

  saveProduct(product) {
    let products = this.get('products') || [];
    const idx = products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      products[idx] = { ...products[idx], ...product, updatedAt: new Date().toISOString() };
    } else {
      product.id = 'p' + Date.now();
      product.createdAt = new Date().toISOString();
      product.updatedAt = new Date().toISOString();
      products.push(product);
    }
    this.set('products', products);
    this.updateCategoryCount(product.categoryId);
    return product;
  },

  deleteProduct(id) {
    let products = this.get('products') || [];
    const product = products.find(p => p.id === id);
    products = products.filter(p => p.id !== id);
    this.set('products', products);
    if (product) this.updateCategoryCount(product.categoryId);
  },

  toggleProductActive(id) {
    let products = this.get('products') || [];
    const idx = products.findIndex(p => p.id === id);
    if (idx >= 0) {
      products[idx].active = !products[idx].active;
      this.set('products', products);
      this.updateCategoryCount(products[idx].categoryId);
    }
  },

  // ============================================
  // CATEGORIES
  // ============================================
  getCategories(activeOnly = false) {
    let cats = this.get('categories') || [];
    if (activeOnly) cats = cats.filter(c => c.active);
    return cats.sort((a, b) => a.order - b.order);
  },

  getCategoryById(id) {
    return (this.get('categories') || []).find(c => c.id === id);
  },

  saveCategory(category) {
    let cats = this.get('categories') || [];
    const idx = cats.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      cats[idx] = { ...cats[idx], ...category };
    } else {
      category.id = 'c' + Date.now();
      category.productsCount = 0;
      cats.push(category);
    }
    this.set('categories', cats);
    return category;
  },

  deleteCategory(id) {
    let cats = this.get('categories') || [];
    this.set('categories', cats.filter(c => c.id !== id));
  },

  updateCategoryCount(categoryId) {
    const products = this.get('products') || [];
    let cats = this.get('categories') || [];
    const idx = cats.findIndex(c => c.id === categoryId);
    if (idx >= 0) {
      cats[idx].productsCount = products.filter(p => p.categoryId === categoryId && p.active).length;
      this.set('categories', cats);
    }
  },

  // ============================================
  // CART
  // ============================================
  getCart() { return this.get('cart') || []; },

  addToCart(item) {
    let cart = this.getCart();
    // Check if same product + size + color already in cart
    const existingIdx = cart.findIndex(i =>
      i.productId === item.productId &&
      i.size === item.size &&
      i.color === item.color
    );
    if (existingIdx >= 0) {
      cart[existingIdx].qty += item.qty;
    } else {
      cart.push({ ...item, cartId: 'ci' + Date.now() });
    }
    this.set('cart', cart);
    return cart;
  },

  updateCartItem(cartId, qty) {
    let cart = this.getCart();
    const idx = cart.findIndex(i => i.cartId === cartId);
    if (idx >= 0) {
      if (qty <= 0) cart.splice(idx, 1);
      else cart[idx].qty = qty;
    }
    this.set('cart', cart);
    return cart;
  },

  removeFromCart(cartId) {
    let cart = this.getCart().filter(i => i.cartId !== cartId);
    this.set('cart', cart);
    return cart;
  },

  clearCart() { this.set('cart', []); },

  getCartTotal() {
    return this.getCart().reduce((sum, i) => sum + (i.price * i.qty), 0);
  },

  getCartCount() {
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  // ============================================
  // WISHLIST
  // ============================================
  getWishlist() { return this.get('wishlist') || []; },

  toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    const idx = wishlist.indexOf(productId);
    if (idx >= 0) wishlist.splice(idx, 1);
    else wishlist.push(productId);
    this.set('wishlist', wishlist);
    return wishlist;
  },

  isInWishlist(productId) {
    return this.getWishlist().includes(productId);
  },

  // ============================================
  // ORDERS
  // ============================================
  getOrders(filters = {}) {
    let orders = this.get('orders') || [];
    if (filters.status) orders = orders.filter(o => o.status === filters.status);
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return orders;
  },

  getOrderById(id) {
    return (this.get('orders') || []).find(o => o.id === id);
  },

  createOrder(orderData) {
    const orders = this.get('orders') || [];
    const num = 'ORD-' + String(orders.length + 1).padStart(3, '0');
    const order = {
      ...orderData,
      id: num,
      orderNumber: num,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(order);
    this.set('orders', orders);

    // Update product sales & stock
    order.items.forEach(item => {
      this.decreaseStock(item.productId, item.qty, item.size, item.color);
    });

    // Save customer
    this.saveCustomerFromOrder(order);

    this.clearCart();
    return order;
  },

  updateOrderStatus(id, status) {
    let orders = this.get('orders') || [];
    const idx = orders.findIndex(o => o.id === id);
    if (idx >= 0) {
      orders[idx].status = status;
      orders[idx].updatedAt = new Date().toISOString();
      this.set('orders', orders);
    }
  },

  // ============================================
  // STOCK
  // ============================================
  decreaseStock(productId, qty, size = null, color = null) {
    let products = this.get('products') || [];
    const idx = products.findIndex(p => p.id === productId);
    if (idx < 0) return;
    const p = products[idx];
    p.salesCount = (p.salesCount || 0) + qty;

    if (size && p.sizes) {
      const sIdx = p.sizes.findIndex(s => s.name === size);
      if (sIdx >= 0) p.sizes[sIdx].qty = Math.max(0, p.sizes[sIdx].qty - qty);
    }

    if (color && p.colors) {
      const cIdx = p.colors.findIndex(c => c.name === color);
      if (cIdx >= 0) p.colors[cIdx].qty = Math.max(0, p.colors[cIdx].qty - qty);
    }

    p.qty = Math.max(0, p.qty - qty);
    products[idx] = p;
    this.set('products', products);
  },

  getLowStockProducts() {
    const settings = this.get('settings') || {};
    const threshold = settings.lowStockThreshold || 5;
    return (this.get('products') || []).filter(p => p.active && p.qty <= threshold);
  },

  // ============================================
  // CUSTOMERS
  // ============================================
  getCustomers() { return this.get('customers') || []; },

  getCustomerByPhone(phone) {
    return (this.getCustomers()).find(c => c.phone === phone);
  },

  saveCustomerFromOrder(order) {
    let customers = this.getCustomers();
    const phone = order.customer.phone;
    const idx = customers.findIndex(c => c.phone === phone);
    if (idx >= 0) {
      customers[idx].ordersCount = (customers[idx].ordersCount || 0) + 1;
      customers[idx].totalSpent = (customers[idx].totalSpent || 0) + order.total;
      customers[idx].lastOrderAt = order.createdAt;
    } else {
      customers.push({
        id: 'cust' + Date.now(),
        name: order.customer.name,
        phone: order.customer.phone,
        whatsapp: order.customer.whatsapp,
        governorate: order.customer.governorate,
        ordersCount: 1,
        totalSpent: order.total,
        firstOrderAt: order.createdAt,
        lastOrderAt: order.createdAt
      });
    }
    this.set('customers', customers);
  },

  // ============================================
  // COUPONS
  // ============================================
  getCoupons() { return this.get('coupons') || []; },

  validateCoupon(code, orderTotal) {
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!coupon) return { valid: false, message: 'كود الخصم غير صحيح' };
    if (new Date(coupon.expiresAt) < new Date()) return { valid: false, message: 'انتهت صلاحية الكود' };
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { valid: false, message: 'تم الوصول للحد الأقصى لاستخدام الكود' };
    if (coupon.minOrder && orderTotal < coupon.minOrder) return { valid: false, message: `الحد الأدنى للطلب ${coupon.minOrder} جنيه` };

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round(orderTotal * coupon.value / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }

    return { valid: true, coupon, discount };
  },

  useCoupon(code) {
    let coupons = this.getCoupons();
    const idx = coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
    if (idx >= 0) {
      coupons[idx].usedCount = (coupons[idx].usedCount || 0) + 1;
      this.set('coupons', coupons);
    }
  },

  saveCoupon(coupon) {
    let coupons = this.getCoupons();
    const idx = coupons.findIndex(c => c.id === coupon.id);
    if (idx >= 0) coupons[idx] = { ...coupons[idx], ...coupon };
    else { coupon.id = 'cp' + Date.now(); coupon.usedCount = 0; coupon.createdAt = new Date().toISOString(); coupons.push(coupon); }
    this.set('coupons', coupons);
    return coupon;
  },

  deleteCoupon(id) {
    this.set('coupons', this.getCoupons().filter(c => c.id !== id));
  },

  // ============================================
  // SHIPPING
  // ============================================
  getShipping() { return this.get('shipping') || { baseRate: 60, governorates: [] }; },

  getShippingRate(governorateName) {
    const shipping = this.getShipping();
    const gov = shipping.governorates.find(g => g.name === governorateName);
    return gov ? gov.rate : shipping.baseRate;
  },

  // ============================================
  // BANNERS
  // ============================================
  getBanners(activeOnly = true) {
    let banners = this.get('banners') || [];
    if (activeOnly) banners = banners.filter(b => b.active);
    return banners.sort((a, b) => a.order - b.order);
  },

  saveBanner(banner) {
    let banners = this.get('banners') || [];
    const idx = banners.findIndex(b => b.id === banner.id);
    if (idx >= 0) banners[idx] = { ...banners[idx], ...banner };
    else { banner.id = 'b' + Date.now(); banners.push(banner); }
    this.set('banners', banners);
    return banner;
  },

  deleteBanner(id) {
    this.set('banners', (this.get('banners') || []).filter(b => b.id !== id));
  },

  // ============================================
  // REVIEWS
  // ============================================
  getReviews(productId = null, approvedOnly = true) {
    let reviews = this.get('reviews') || [];
    if (productId) reviews = reviews.filter(r => r.productId === productId);
    if (approvedOnly) reviews = reviews.filter(r => r.approved);
    return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  addReview(review) {
    let reviews = this.get('reviews') || [];
    review.id = 'r' + Date.now();
    review.approved = true; // Auto approve for demo
    review.date = new Date().toISOString().split('T')[0];
    reviews.push(review);
    this.set('reviews', reviews);

    // Update product rating
    this.recalcProductRating(review.productId);
    return review;
  },

  recalcProductRating(productId) {
    const reviews = this.getReviews(productId);
    if (!reviews.length) return;
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

    let products = this.get('products') || [];
    const idx = products.findIndex(p => p.id === productId);
    if (idx >= 0) {
      products[idx].rating = Math.round(avg * 10) / 10;
      products[idx].reviewsCount = reviews.length;
      this.set('products', products);
    }
  },

  // ============================================
  // ADMINS
  // ============================================
  getAdmins() { return this.get('admins') || []; },

  getAdminById(id) { return this.getAdmins().find(a => a.id === id); },

  authenticateAdmin(username, password) {
    const admins = this.getAdmins();
    const admin = admins.find(a =>
      a.username.toLowerCase() === username.toLowerCase() &&
      a.password === this.hashPassword(password) &&
      a.active
    );
    if (admin) {
      // Update last login
      let adminsArr = this.getAdmins();
      const idx = adminsArr.findIndex(a => a.id === admin.id);
      if (idx >= 0) { adminsArr[idx].lastLogin = new Date().toISOString(); this.set('admins', adminsArr); }
    }
    return admin || null;
  },

  saveAdmin(admin) {
    let admins = this.getAdmins();
    const idx = admins.findIndex(a => a.id === admin.id);
    if (admin.password && !admin.password.startsWith('$')) {
      admin.password = this.hashPassword(admin.password);
    }
    if (idx >= 0) admins[idx] = { ...admins[idx], ...admin };
    else { admin.id = 'a' + Date.now(); admin.createdAt = new Date().toISOString(); admins.push(admin); }
    this.set('admins', admins);
    return admin;
  },

  deleteAdmin(id) {
    this.set('admins', this.getAdmins().filter(a => a.id !== id));
  },

  changeAdminPassword(adminId, oldPassword, newPassword) {
    const admins = this.getAdmins();
    const idx = admins.findIndex(a => a.id === adminId && a.password === this.hashPassword(oldPassword));
    if (idx >= 0) {
      admins[idx].password = this.hashPassword(newPassword);
      this.set('admins', admins);
      return true;
    }
    return false;
  },

  resetPasswordWithCode(username, newPassword, recoveryCode) {
    const admins = this.getAdmins();
    const owner = admins.find(a => a.role === 'owner' || a.role === 'super_admin');
    const adminIdx = admins.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
    
    if (adminIdx >= 0 && owner && owner.recoveryCode === recoveryCode) {
      admins[adminIdx].password = this.hashPassword(newPassword);
      this.set('admins', admins);
      return true;
    }
    return false;
  },

  // ============================================
  // SESSION (Admin Auth)
  // ============================================
  setSession(admin) {
    sessionStorage.setItem('fayonka_admin', JSON.stringify({ id: admin.id, role: admin.role, name: admin.name }));
  },

  getSession() {
    try { return JSON.parse(sessionStorage.getItem('fayonka_admin')); } catch { return null; }
  },

  clearSession() { sessionStorage.removeItem('fayonka_admin'); },

  // ============================================
  // ACTIVITY LOG
  // ============================================
  log(adminId, adminName, action, entity, entityId, details) {
    let log = this.get('activityLog') || [];
    log.unshift({ id: 'l' + Date.now(), adminId, adminName, action, entity, entityId, details, at: new Date().toISOString() });
    if (log.length > 500) log = log.slice(0, 500); // Keep last 500
    this.set('activityLog', log);
  },

  getActivityLog() { return this.get('activityLog') || []; },

  // ============================================
  // ANALYTICS
  // ============================================
  getStats() {
    const orders = this.getOrders();
    const products = this.getProducts({ active: true });
    const customers = this.getCustomers();

    const delivered = orders.filter(o => o.status === 'delivered');
    const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;

    // Daily revenue (last 7 days)
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOrders = delivered.filter(o => o.createdAt.startsWith(dateStr));
      last7.push({ date: dateStr, revenue: dayOrders.reduce((s, o) => s + o.total, 0), orders: dayOrders.length });
    }

    // Monthly revenue
    const monthlyMap = {};
    delivered.forEach(o => {
      const month = o.createdAt.substring(0, 7);
      monthlyMap[month] = (monthlyMap[month] || 0) + o.total;
    });

    // Best selling products
    const bestSelling = products.sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);

    return {
      totalRevenue, totalOrders, cancelledOrders, shippedOrders,
      totalCustomers: customers.length,
      totalProducts: products.length,
      last7Days: last7,
      monthly: monthlyMap,
      bestSelling,
      newOrders: orders.filter(o => o.status === 'new').length
    };
  },

  // ============================================
  // RECENTLY VIEWED
  // ============================================
  addRecentlyViewed(productId) {
    let recent = this.get('recentlyViewed') || [];
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    if (recent.length > 10) recent = recent.slice(0, 10);
    this.set('recentlyViewed', recent);
  },

  getRecentlyViewed() {
    const ids = this.get('recentlyViewed') || [];
    return ids.map(id => this.getProductById(id)).filter(Boolean);
  },

  // ============================================
  // SETTINGS
  // ============================================
  getSettings() { return this.get('settings') || {}; },

  saveSettings(settings) { this.set('settings', { ...this.getSettings(), ...settings }); },

  // ============================================
  // HELPERS
  // ============================================
  hashPassword(password) {
    // Simple hash for demo purposes
    let hash = 0;
    const salt = 'fayonka_salt_2024';
    const str = password + salt;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return '$fyk$' + Math.abs(hash).toString(16);
  },

  generateSKU(category) {
    const prefix = category.slice(0, 3).toUpperCase();
    return prefix + '-' + Date.now().toString().slice(-6);
  }
};

// Auto-initialize
DB.init();
