// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, Icon } from 'semantic-ui-react';

interface EditEventProps {
  addMessage: (message: Message) => any;
  cancel: () => void;
  loading: (status: boolean) => any;
  originalEvent: VPEvent;
  refresh: () => void;
}

interface EditEventState {
  name: string;
  description: string;
  address: string;
  transport: string;
  active: boolean;
}

export default class EditEvent extends React.Component<EditEventProps, EditEventState> {
  constructor(props: EditEventProps) {
    super(props);

    this.state = {
      name: props.originalEvent.name,
      description: props.originalEvent.description,
      address: props.originalEvent.address,
      transport: props.originalEvent.transport,
      active: props.originalEvent.active,
    };
  }

  public componentWillReceiveProps(nextProps: EditEventProps) {
    if (this.props.originalEvent.event_id !== nextProps.originalEvent.event_id) {
      this.setState({
        name: nextProps.originalEvent.name,
        description: nextProps.originalEvent.description,
        address: nextProps.originalEvent.address,
        transport: nextProps.originalEvent.transport,
        active: nextProps.originalEvent.active,
      });
    }
  }

  public handleChange = (e: React.FormEvent<any>, { name, value, checked }: any) => {
    this.setState({ [name]: value || checked });
  };

  public handleSubmit = () => {
    const { name, description, address, transport, active } = this.state;
    // tslint:disable-next-line:no-console
    console.log(name, description, address, transport);
    Promise.resolve(this.props.loading(true))
      .then(() =>
        axios.post(
          `/api/events/${this.props.originalEvent.event_id}`,
          { name, description, address, transport, active },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
          },
        ),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.refresh();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => this.props.loading(false));
  };

  public handleDelete = () => {
    Promise.resolve(this.props.loading(true))
      .then(() =>
        axios.delete(`/api/events/${this.props.originalEvent.event_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.refresh();
        // deselect event (cause it's gone)
        this.props.cancel();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => this.props.loading(false));
  };

  public render() {
    const { name, description, address, transport, active } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          fluid
          label="Name"
          name="name"
          value={name}
          placeholder="A Super Cool Event"
          onChange={this.handleChange}
          required
        />
        <Form.Checkbox
          label="Show event on Events page?"
          name="active"
          checked={active}
          onChange={this.handleChange}
        />
        <Form.TextArea
          label="Description"
          name="description"
          value={description}
          placeholder="This is gonna be super cool. Sign up please my life depends on it."
          onChange={this.handleChange}
          required
        />
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Address"
            name="address"
            value={address}
            placeholder="1234 Sesame Street"
            onChange={this.handleChange}
            required
          />
          <Form.Input
            fluid
            label="Transportation provided from"
            name="transport"
            value={transport}
            placeholder="None provided"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Button.Group fluid>
            <Button type="submit" animated="fade" primary>
              <Button.Content hidden>Save</Button.Content>
              <Button.Content visible>
                <Icon name="save" />
              </Button.Content>
            </Button>
            <Button onClick={this.handleDelete} animated="fade" negative>
              <Button.Content hidden>Delete</Button.Content>
              <Button.Content visible>
                <Icon name="trash" />
              </Button.Content>
            </Button>
            <Button onClick={this.props.cancel} animated="fade">
              <Button.Content hidden>Cancel</Button.Content>
              <Button.Content visible>
                <Icon name="delete" />
              </Button.Content>
            </Button>
          </Button.Group>
        </Form.Group>
      </Form>
    );
  }
}