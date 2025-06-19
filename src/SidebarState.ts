class SidebarState {
    private static readonly STORAGE_KEYS = {
        COLLAPSED: 'sidebarCollapsed',
        EXPANDED_CATEGORIES: 'expandedCategories'
    };
    private static readonly COLLAPSE_WIDTH = 1030;

    public init() {
        this.loadInitialState();
        this.setupEventListeners();
    }

    private loadInitialState() {
        const isCollapsed = localStorage.getItem(SidebarState.STORAGE_KEYS.COLLAPSED) === 'true';
        if (isCollapsed || window.innerWidth < SidebarState.COLLAPSE_WIDTH) {
            this.toggleCollapsed(true);
        }
        this.restoreExpandedCategories();
    }

    private setupEventListeners() {
        const toggleBtn = document.querySelector('.toggle-btn');
        toggleBtn?.addEventListener('click', () => this.toggleSidebar());

        const togglers = document.getElementsByClassName('caret');
        Array.from(togglers).forEach(toggler => {
            toggler.addEventListener('click', () => this.toggleCategory(toggler as HTMLElement));
        });
    }

    private toggleSidebar() {
        const sidenav = document.querySelector('.sidenav');
        const main = document.querySelector('.main');
        const toggleBtn = document.querySelector('.toggle-btn');

        const isCollapsed = sidenav?.classList.toggle('collapsed');
        toggleBtn?.classList.toggle('collapsed');
        main?.classList.toggle('collapsed');

        localStorage.setItem(SidebarState.STORAGE_KEYS.COLLAPSED, String(isCollapsed));
    }

    private toggleCategory(toggler: HTMLElement) {
        const nestedList = toggler.parentElement?.querySelector('.nested');
        if (nestedList) {
            nestedList.classList.toggle('active');
            toggler.classList.toggle('caret-down');
            this.saveExpandedCategories();
        }
    }

    private toggleCollapsed(value: boolean) {
        const sidenav = document.querySelector('.sidenav');
        const main = document.querySelector('.main');
        const toggleBtn = document.querySelector('.toggle-btn');

        if (value) {
            sidenav?.classList.add('collapsed');
            toggleBtn?.classList.add('collapsed');
            main?.classList.add('collapsed');
        } else {
            sidenav?.classList.remove('collapsed');
            toggleBtn?.classList.remove('collapsed');
            main?.classList.remove('collapsed');
        }
    }

    private saveExpandedCategories() {
        const expandedCategories = Array.from(document.getElementsByClassName('caret'))
            .filter(caret => caret.classList.contains('caret-down'))
            .map(caret => caret.textContent?.trim())
            .filter(Boolean);

        localStorage.setItem(
            SidebarState.STORAGE_KEYS.EXPANDED_CATEGORIES,
            JSON.stringify(expandedCategories)
        );
    }

    private restoreExpandedCategories() {
        try {
            const expandedCategories: string[] = JSON.parse(
                localStorage.getItem(SidebarState.STORAGE_KEYS.EXPANDED_CATEGORIES) || '[]'
            );

            const togglers = document.getElementsByClassName('caret');
            Array.from(togglers).forEach(toggler => {
                const category = toggler.textContent?.trim();
                if (category && expandedCategories.includes(category)) {
                    const nestedList = toggler.parentElement?.querySelector('.nested');
                    if (nestedList) {
                        nestedList.classList.add('active');
                        toggler.classList.add('caret-down');
                    }
                }
            });
        } catch (e) {
            console.error('Error restoring categories:', e);
            localStorage.removeItem(SidebarState.STORAGE_KEYS.EXPANDED_CATEGORIES);
        }
    }
}

export const sidebarState = new SidebarState();