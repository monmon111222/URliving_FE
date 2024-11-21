import React from "react";

class Breadcrumb extends React.Component {
	render() {
		return (
			<div className="product-breadcrumb">
				<a href="/">首頁</a>
				{!this.props.noMain && this.props.sitemap.main && (
					<span className="product-breadcrumb-item">
						<a href={`/${this.props.sitemap.main.code}`}>{this.props.sitemap.main.name}</a>
					</span>
				)}
				{this.props.sitemap.sub && (
					<span className="product-breadcrumb-item">
						<a href={`/${this.props.sitemap.main.code}/${this.props.sitemap.sub.code}`}>
							{this.props.sitemap.sub.name}
						</a>
					</span>
				)}
				{this.props.sitemap.item && (
					<span className="product-breadcrumb-item">
						<a href={`/${this.props.sitemap.main.code}/${this.props.sitemap.sub.code}/${this.props.sitemap.item.code}`}>
							{this.props.sitemap.item.name}
						</a>
					</span>
				)}
				{this.props.sitemap.product && (
					<span className="product-breadcrumb-item">
						<a href={window.location.pathname}>{this.props.sitemap.product.name}</a>
					</span>
				)}
			</div>
		);
	}
}

module.exports = Breadcrumb;
