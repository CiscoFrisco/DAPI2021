Length <- OverviewSizes$length;
h <- hist(Length, main="Overview text size", xlab="Number of characters", col="deepskyblue", ylim=c(0, 400), breaks=seq(0,2600,200), xaxp=c(0,2600,13));
text(h$mids, h$counts, labels=h$counts, adj=c(0.5,-0.5))

