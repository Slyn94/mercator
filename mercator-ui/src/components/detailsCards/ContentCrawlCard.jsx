import BorderWrapper from 'react-border-wrapper'
import Wappalyzer from "./Wappalyzer";
import moment from "moment";
import { Row, Col, Table} from "react-bootstrap";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { renderDataBoolean } from '../../services/Util';

const ContentCrawlCard = (props) => {

    const visitId = props.visitId

    const [data, setData] = useState([]);

    useEffect(() => {
        const handlerData = async () => {

            const url = `/contentCrawlResults/search/findByVisitId?visitId=${visitId}`;
            await api.get(url)
                .then((resp) => {
                    if(resp.status === 200) {
                        setData(resp === undefined ? null : resp.data._embedded.contentCrawlResults);
                    }
                })
                .catch((ex) => {
                    console.log(ex);
                });      
        };

        handlerData();
    }, [visitId]);

    // Variables for HTML
    const {openMetrics, setOpenMetrics, openTechnologies, setOpenTechnologies, openUrls, setOpenUrls} = props; // Used deciding open/close of Accordions.
    const prefix = window._env_.REACT_APP_MUPPETS_HOST + "/" || '';
    const topElement = <p className='top-element'>Content crawl</p> // BorderWrapper's "title".

    // Writing HTML on a function base so we can define logic more easily.
    const renderHTML = () => { //TODO: ??? Validity check
        if (!data.length || data.length === 0) {
            return (
                <Row>
                    <Col className='mt-4'>
                        <BorderWrapper borderWidth="3px" borderRadius="0px" innerPadding="30px"
                                        topElement={topElement}
                                        topPosition={0.07} topOffset="15px" topGap="15px">
                            <p>No data for this visit</p>
                        </BorderWrapper>
                    </Col>
                </Row>
            )
        }

        return (
            <>
                {
                    data.map((data) => {
                        return (
                            <Row key={data.visitId}>
                                <Col className='mt-4'>
                                    <BorderWrapper
                                        borderWidth="3px" borderRadius="0px" innerPadding="30px"
                                        topElement={topElement}
                                        topPosition={0.07} topOffset="15px" topGap="15px"
                                    >
                                        <div className='content-table'>

                                            <Table size='sm' borderless>
                                                <tbody className='text-left'>

                                                    <tr>
                                                        <th scope='row'>
                                                            Id
                                                        </th>
                                                        <td>
                                                            {data.id}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <th scope='row'>
                                                            Metrics Json
                                                        </th>
                                                        <td>
                                                            {
                                                                data.metricsJson ? // metricsJson exists? render, else empty string.
                                                                    <>
                                                                        <button 
                                                                            className='more-info'
                                                                            onClick={() => setOpenMetrics(openMetrics => !openMetrics)} // Toggle openMetrics boolean
                                                                        > 
                                                                            More info
                                                                        </button>

                                                                        {   // if openMetrics === true, render
                                                                            openMetrics && (
                                                                                <div id='metricsJson-content'>
                                                                                    <ul className="mb-2 mt-2">
                                                                                        {
                                                                                            Object.entries(JSON.parse(data.metricsJson)).map((item, index) => {
                                                                                                return (
                                                                                                    <li key={index}>
                                                                                                        <span
                                                                                                            className='font-weight-bold'
                                                                                                        >
                                                                                                            { item[0] }:
                                                                                                        </span>
                                                                                                        <span> { item[1] }</span>
                                                                                                    </li>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </ul>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </> :
                                                                    "" // metricsJson exists? render, else empty string.
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">URL</th>
                                                        <td>{data.url}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Ok</th>
                                                        { renderDataBoolean(data.ok) }
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Problem</th>
                                                        <td className="problem-content">{data.problem}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Final Url</th>
                                                        <td>{data.finalUrl}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">HTML length</th>
                                                        <td>{data.htmlLength}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Crawl Timestamp</th>
                                                        <td>{data.crawlTimestamp ? moment(data.crawlTimestamp).format("DD/MM/YYYY HH:mm:ss") : ''}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Crawled from</th>
                                                        <td>ipv4: {data.ipv4}, ipv6: {data.ipv6}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Browser version</th>
                                                        <td>{data.browserVersion}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>

                                            <div className="mb-4 mt-4 ml-4">

                                                <button 
                                                    className="mr-5 ml-5 content-card-link-button"
                                                    onClick={() => window.open(prefix + data.screenshotKey)}
                                                >
                                                    Screenshot
                                                </button>

                                                <button 
                                                    className="mr-5 ml-5 content-card-link-button"
                                                    onClick={() => window.open(prefix + data.htmlKey)}
                                                >
                                                        HTML
                                                </button>

                                                <button 
                                                    className="ml-5 content-card-link-button"
                                                    onClick={() => window.open(prefix + data.harKey)}
                                                >
                                                    Har
                                                </button>

                                            </div>

                                            <Wappalyzer 
                                                visitId={visitId} 
                                                openTechnologies={openTechnologies}
                                                setOpenTechnologies={setOpenTechnologies} 
                                                openUrls={openUrls}
                                                setOpenUrls={setOpenUrls}
                                            />

                                        </div>
                                    </BorderWrapper>
                                </Col>
                            </Row>
                        );
                    })
                }
            </>
        );
    }


    // This file's HTML return.
    return (
        <>
            { renderHTML() }
        </>
    );
}

export default ContentCrawlCard;