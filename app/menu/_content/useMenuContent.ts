import { useState, useEffect } from 'react';

// Simple URL validation function
function validateHref(url: string, context?: string): string {
  if (!url) return '';
  // Basic validation - allow relative paths, absolute URLs, tel: links, etc.
  if (url.startsWith('/') || url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:')) {
    return url;
  }
  console.warn(`Invalid URL in ${context}: ${url}`);
  return '';
}

interface MenuContent {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
    subtitle: string;
    buttons: {
      bookOnline: {
        label: string;
        url: string;
        target: string;
        style: string;
      };
      orderTakeaway: {
        label: string;
        url: string;
        style: string;
      };
    };
  };
  interactive: {
    search: {
      placeholder: string;
      toggleLabel: string;
      hideLabel: string;
      clearLabel: string;
      activeLabel: string;
    };
    navigation: {
      allSectionsLabel: string;
      menuCategoriesLabel: string;
      noItemsMessage: string;
    };
    results: {
      showingPrefix: string;
      itemsSuffix: string;
      matchingText: string;
      withFiltersText: string;
    };
  };
  ui: {
    loading: {
      message: string;
      error: string;
    };
  };
}

// Validate and sanitize menu content URLs
function validateMenuContent(content: any): MenuContent {
  if (!content) throw new Error('No menu content provided');
  
  // Validate button URLs if they exist
  if (content.hero?.buttons) {
    if (content.hero.buttons.bookOnline?.url) {
      content.hero.buttons.bookOnline.url = validateHref(
        content.hero.buttons.bookOnline.url, 
        'menu bookOnline button'
      ) as string;
    }
    if (content.hero.buttons.orderTakeaway?.url) {
      content.hero.buttons.orderTakeaway.url = validateHref(
        content.hero.buttons.orderTakeaway.url, 
        'menu orderTakeaway button'
      ) as string;
    }
  }
  
  return content as MenuContent;
}

export function useMenuContent(): MenuContent | null {
  const [content, setContent] = useState<MenuContent | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        // Load content directly from local file since API endpoint was removed
        const { default: fallbackContent } = await import('./menu-content.json');
        const validatedFallback = validateMenuContent(fallbackContent);
        setContent(validatedFallback);
      } catch (error) {
        console.error('Menu content loading error:', error);
        // Use inline fallback as last resort
        const inlineFallback = {
          meta: {
            title: "Menu - Nepalese & Pub Classics",
            description: "Our curated menu"
          },
          hero: {
            title: "Menu — Nepalese & Pub Classics",
            subtitle: "Curated menu — quick to scan. Book or order takeaway.",
            buttons: {
              bookOnline: {
                label: "Book Online",
                url: "https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true",
                target: "_blank",
                style: "primary"
              },
              orderTakeaway: {
                label: "Order Takeaway",
                url: "tel:01223276027",
                style: "secondary"
              }
            }
          },
          interactive: {
            search: {
              placeholder: "Search menu items...",
              toggleLabel: "Search & Filter",
              hideLabel: "Hide Search",
              clearLabel: "Clear All",
              activeLabel: "Active"
            },
            navigation: {
              allSectionsLabel: "All",
              menuCategoriesLabel: "Menu categories",
              noItemsMessage: "No items match current filters"
            },
            results: {
              showingPrefix: "Showing",
              itemsSuffix: "items",
              matchingText: "matching",
              withFiltersText: "with applied filters"
            }
          },
          ui: {
            loading: {
              message: "Loading menu...",
              error: "Failed to load menu content"
            }
          }
        };
        const validatedInlineFallback = validateMenuContent(inlineFallback);
        setContent(validatedInlineFallback);
      }
    }

    loadContent();
  }, []);

  return content;
}