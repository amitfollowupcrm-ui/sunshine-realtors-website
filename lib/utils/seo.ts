// SEO utility functions

import type { Property } from '@/types/property.types';

/**
 * Generate property schema markup (JSON-LD)
 */
export function generatePropertySchema(property: Property) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description,
    image: property.media?.primaryImageUrl || property.media?.imageUrls?.[0],
    offers: {
      '@type': 'Offer',
      price: property.pricing.price,
      priceCurrency: property.pricing.currency || 'INR',
      availability: property.status === 'ACTIVE' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://sunshinerealtors.com'}/properties/${property.slug}`,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location.locality,
      addressRegion: property.location.state,
      postalCode: property.location.pincode,
      addressCountry: property.location.country || 'IN',
    },
    numberOfRooms: property.details.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.details.builtUpArea || property.details.carpetArea,
      unitCode: property.details.areaUnit === 'sqmt' ? 'MTK' : 'SQM',
    },
  };
}

/**
 * Generate organization schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Sunshine Realtors Group',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://sunshinerealtors.com',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://sunshinerealtors.com'}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-1800-123-4567',
      contactType: 'customer service',
      areaServed: ['IN'],
      availableLanguage: ['en', 'hi'],
    },
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'North India',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'State',
      name: ['Punjab', 'Haryana', 'Himachal Pradesh', 'Delhi', 'Rajasthan', 'Uttar Pradesh', 'Uttarakhand'],
    },
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}





