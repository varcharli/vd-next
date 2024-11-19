
export class ScraperSetting {
    initFinished?: boolean;
    initLastPage?: number;
    initEndDate?: string;
}

export class ScraperItemDto {
    id: number;
    projectId: number;
    name?: string;
    url: string;
    movieId?: number;
    finished: boolean;
  }

  export class ScraperProjectDto {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    pageNumber?: number;
    count?: number;
    description?: string;
    indexFinished: boolean;
    finished: boolean;
  }

  export class ScraperLogDto {
    id: number;
    name: string;
    log: string;
    time: string;
  }