
// ===== PAGINAÇÃO BACKEND =====
class Pagination {
    constructor(containerId, itemsPerPage = 10) {
        this.containerId = containerId;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 0;
        this.totalPages = 0;
        this.totalItems = 0;
        this.renderCallback = null;
        this.remoteLoader = null;

        // Registra a instância globalmente com ID único
        if (!window.paginationInstances) {
            window.paginationInstances = {};
        }
        window.paginationInstances[containerId] = this;
    }

    updateFromApiResponse(response) {
        this.totalItems = response.totalElements ?? 0;
        this.totalPages = response.totalPages ?? 1;
        this.currentPage = response.pageNumber ?? 0;
    }

    setRemoteLoader(callback) {
        this.remoteLoader = callback;
    }

    renderPaginationControls() {
        if (this.totalPages <= 1) return '';

        const start = this.currentPage * this.itemsPerPage + 1;
        const end = Math.min((this.currentPage + 1) * this.itemsPerPage, this.totalItems);

        let pagesHtml = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1)
            startPage = Math.max(0, endPage - maxVisiblePages + 1);

        for (let i = startPage; i <= endPage; i++) {
            pagesHtml += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="window.paginationInstances['${this.containerId}'].goToPageAndRender(${i})">
                    ${i + 1}
                </button>
            `;
        }

        return `
            <div class="pagination-controls-inner">
                <div class="pagination-buttons">
                    <button class="pagination-btn" 
                            onclick="window.paginationInstances['${this.containerId}'].prevPageAndRender()" 
                            ${this.currentPage === 0 ? 'disabled' : ''}>
                        ← Anterior
                    </button>
                    ${pagesHtml}
                    <button class="pagination-btn" 
                            onclick="window.paginationInstances['${this.containerId}'].nextPageAndRender()" 
                            ${this.currentPage >= this.totalPages - 1 ? 'disabled' : ''}>
                        Próxima →
                    </button>
                </div>
                <div class="pagination-info">
                    Mostrando ${start} a ${end} de ${this.totalItems} registros
                </div>
            </div>
        `;
    }

    async goToPageAndRender(page) {
        if (this.remoteLoader && page >= 0 && page < this.totalPages) {
            await this.remoteLoader(page);
        }
    }

    async nextPageAndRender() {
        if (this.remoteLoader && this.currentPage < this.totalPages - 1) {
            await this.remoteLoader(this.currentPage + 1);
        }
    }

    async prevPageAndRender() {
        if (this.remoteLoader && this.currentPage > 0) {
            await this.remoteLoader(this.currentPage - 1);
        }
    }
}