import { useState, useEffect } from 'react';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

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

export function useMenuContent(): MenuContent | null {
  const [content, setContent] = useState<MenuContent | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
  const response = await fetchWithResilience('/api/menu-content');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        } else {
          // Fallback to local import
          const { default: fallbackContent } = await import('./menu-content.json');
          setContent(fallbackContent);
        }
      } catch (error) {
        // Use inline fallback as last resort
        setContent({
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
        });
      }
    }

    loadContent();
  }, []);

  return content;
}