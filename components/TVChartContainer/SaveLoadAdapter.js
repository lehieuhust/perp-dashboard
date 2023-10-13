export class SaveLoadAdapter {
  constructor(symbol, charts, setTvCharts) {
    this.charts = charts;
    this.setTvCharts = setTvCharts;
    this.symbol = symbol;
  }

  getAllCharts() {
    return Promise.resolve(this.charts);
  }

  removeChart(id) {
    if (!this.charts) return Promise.reject();
    for (let i = 0; i < this.charts.length; ++i) {
      if (this.charts[i].id === id) {
        this.charts.splice(i, 1);
        this.setTvCharts(this.charts);
        return Promise.resolve();
      }
    }

    return Promise.reject();
  }

  saveChart(chartData) {
    if (!chartData.id) {
      chartData.id = Math.random().toString();
    } else {
      this.removeChart(chartData.id);
    }

    chartData.timestamp = new Date().valueOf();

    if (this.charts) {
      this.charts.push(chartData);
      this.setTvCharts(this.charts);
    }

    return Promise.resolve(chartData.id);
  }

  getChartContent(id) {
    if (!this.charts) return Promise.reject();
    for (let i = 0; i < this.charts.length; ++i) {
      if (this.charts[i].id === id) {
        const { content, symbol } = this.charts[i];
        // TODO:
        // const tokenInfo = getTokenBySymbol(this.symbol, symbol);
        return Promise.resolve(content);
      }
    }
    return Promise.reject();
  }
}
