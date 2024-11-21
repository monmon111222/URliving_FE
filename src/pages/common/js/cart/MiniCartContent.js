import ImagePlaceholder from "components/global/ImagePlaceholder";

const MiniCartContent = ({ data, id, ispre }) => {
	const CartItems = data.map((item) => (
		<li key={item.Barcode}>
			<a href={item.LinkUrl}>
				<div className="subnav--cart__img">
					<ImagePlaceholder src={item.ProductImage} />
				</div>
				<p>{item.ProductName}</p>
				<p>{`SIZE:${item.ProductSize}${ispre ? " (預)" : ""}`}</p>
				<p>{`QTY:${item.Amount}`}</p>
			</a>
		</li>
	));

	return (
		<div id={id}>
			<ul>{CartItems}</ul>
		</div>
	);
};

module.exports = MiniCartContent;
